use anchor_lang::prelude::*;

// Program ID 
declare_id!("3fg4A32dEzRjuh9fEgrXWYqhi2Xy8RdYn5SWH2eNso8v");

#[program]
pub mod first {
    use super::*;
    pub fn create(ctx: Context<Create>)-> Result<()> { // Context argument - accounts, program_id, remaining_accounts
        let counter_account = &mut ctx.accounts.counter_account;
        // msg!("{}",ctx.program_id);
        counter_account.counter = 0;
        counter_account.bump = *ctx.bumps.get("counter_account").unwrap();
        Ok(())
    }

    pub fn update(ctx: Context<Update>, data:u64)-> Result<()>{
        // require!(data < 100, CounterError::DataTooLarge);
        // require!(data >= 0, CounterError::DataTooSmall);
        let counter_account = &mut ctx.accounts.counter_account;
        counter_account.counter = data;
        Ok(())
    }
    
    pub fn close(ctx: Context<Close>) -> Result<()>{
        let counter_account = &mut ctx.accounts.counter_account;
        counter_account.counter = 0;
        Ok(())
    }
}

#[derive(Accounts)] // Deserialize the struct. Provide further functionality with instruction(..) and account(..) attribute
pub struct Create<'info>{
    #[account(
        init, // initialise the account and by default assign the owner to the program
        payer = user, // specify the account that pays for the account creation
        space = 8+8+1, // Space to be allocated for account: 8 -> anchor discriminator, 8 -> data u64, 1 -> bump u8
        seeds = [b"counter-account", user.key().as_ref()], bump)] // PDA for the account
    pub counter_account: Account<'info, CounterAccount>, // Account - Wrapper around account info that verifies program ownership and deserializes data
    #[account(mut)] // check if account is mutable
    pub user: Signer<'info>,    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
// #[instruction(data: u64)] // Attribute to access the instruction attributes, write in same order as in instruction
pub struct Update<'info>{
    pub user: Signer<'info>,            
    #[account(mut, seeds = [b"counter-account", user.key().as_ref()], bump = counter_account.bump)]
    pub counter_account: Account<'info, CounterAccount>,
}

#[derive(Accounts)]
pub struct Close<'info>{
    pub user: Signer<'info>,
    #[account(mut, seeds = [b"counter-account", user.key().as_ref()], bump = counter_account.bump, close = user)]
    pub counter_account: Account<'info, CounterAccount>, // Serialize, Deserialize and checks if the owner of account is 
    pub system_program: Program<'info, System>, 
}

#[account] // Set's program id as owner of the account
pub struct CounterAccount{ // Actual Structure of account
    pub counter: u64,
    pub bump: u8,
}

#[error_code]
pub enum CounterError{
    #[msg("CounterAccount Can only hold below 100")]
    DataTooLarge,

    #[msg("CounterAccount can only hold above 0")]
    DataTooSmall
}