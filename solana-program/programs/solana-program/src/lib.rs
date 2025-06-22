use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo, Burn, Transfer};
use anchor_spl::associated_token::AssociatedToken;
use anchor_lang::solana_program::{program::invoke, system_instruction};

declare_id!("8JZbm5N7EZJaWCjVthdxW5EGsyudJTXNPgNKoNoBR3f1");

#[program]
pub mod solana_program {
    use anchor_lang::solana_program::program::invoke_signed;

    use super::*;

    pub fn create_token(
        ctx: Context<CreateToken>,
        _name: String,
        _symbol: String,
        _decimals: u8,
    ) -> Result<()> {
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.payer.to_account_info(),
            },
        );

        token::mint_to(cpi_ctx, 1_000_000_000)?;

        Ok(())
    }

    pub fn buy(ctx: Context<Buy>, amount: u64) -> Result<()> {
        let price_per_token = 10_000_000 + amount * 1_000_000;
        let total_cost = price_per_token * amount;

        invoke(
            &system_instruction::transfer(
                ctx.accounts.payer.key,
                ctx.accounts.vault.key,
                total_cost,
            ),
            &[
                ctx.accounts.payer.to_account_info(),
                ctx.accounts.vault.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.payer.to_account_info(),
            },
        );
        token::mint_to(cpi_ctx, amount)?;

        Ok(())
    }

    pub fn sell(ctx: Context<Sell>, amount: u64) -> Result<()> {
        let price_per_token = 10_000_000 + amount * 1_000_000;
        let total_payout = price_per_token * amount;

        let (_vault_pda, vault_bump) = Pubkey::find_program_address(&[b"vault"], ctx.program_id);
        let signer_seeds: &[&[u8]] = &[b"vault", &[vault_bump]];

        invoke_signed(
            &system_instruction::transfer(
                ctx.accounts.vault.key,
                ctx.accounts.owner.key,
                total_payout,
            ),
            &[
                ctx.accounts.vault.to_account_info(),
                ctx.accounts.owner.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[signer_seeds],
        )?;

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.mint.to_account_info(),
                from: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.owner.to_account_info(),
            },
        );
        token::burn(cpi_ctx, amount)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateToken<'info> {
    #[account(init, payer = payer, mint::decimals = 6, mint::authority = payer)]
    pub mint: Account<'info, Mint>,

    #[account(init, payer = payer, associated_token::mint = mint, associated_token::authority = payer)]
    pub token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: check
    #[account(mut)]
    pub vault: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct Buy<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,

    /// CHECK: check
    #[account(mut)]
    pub vault: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Sell<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,

    #[account(mut, has_one = owner)]
    pub token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub owner: Signer<'info>,

    /// CHECK: check
    #[account(
        mut,
        seeds = [b"vault"],
        bump
    )]
    pub vault: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}
