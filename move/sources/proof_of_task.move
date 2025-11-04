// MirrorWitness 2025-11-04

module proof_of_task::proof_of_task {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};
    use sui::hash::keccak256;
    use sui::ed25519;
    use std::vector;

    // Error codes
    const E_EXPIRED: u64 = 1;
    const E_PAYLOAD_HASH_MISMATCH: u64 = 2;
    const E_INVALID_SIGNATURE: u64 = 3;
    const E_DUPLICATE_WITNESS: u64 = 4;
    const E_NOT_AUTHORIZED: u64 = 5;

    // Constants
    const TASK_REWARD: u64 = 10_000_000_000; // 10 TASK
    const REQUIRED_WITNESSES: u64 = 3;
    const TASK_EXPIRY_MS: u64 = 300000; // 5 minutes

    // Main Task object
    public struct Task has key, store {
        id: UID,
        staker: address,
        payload: vector<u8>,
        payload_hash: vector<u8>,
        walrus_cid: vector<u8>,
        witness_pubkeys: vector<vector<u8>>,
        witness_sigs: vector<vector<u8>>,
        expires: u64,
    }

    // TASK token
    public struct TASK has drop {}

    // Treasury for minting rewards
    public struct Treasury has key {
        id: UID,
        balance: Balance<TASK>,
    }

    // One-time witness for token creation
    public struct PROOF_OF_TASK has drop {}

    // Initialize the module
    fun init(witness: PROOF_OF_TASK, ctx: &mut TxContext) {
        let (treasury_cap, metadata) = coin::create_currency(
            witness,
            9,
            b"TASK",
            b"Proof of Task Token",
            b"Rewards for verified task completion",
            option::none(),
            ctx
        );

        transfer::public_freeze_object(metadata);
        
        let treasury = Treasury {
            id: object::new(ctx),
            balance: balance::zero(),
        };
        
        transfer::share_object(treasury);
        transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
    }

    // Stake a new task
    public entry fun stake_task(
        payload: vector<u8>,
        walrus_cid: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let payload_hash = keccak256(&payload);
        let expires = clock::timestamp_ms(clock) + TASK_EXPIRY_MS;

        let task = Task {
            id: object::new(ctx),
            staker: tx_context::sender(ctx),
            payload,
            payload_hash,
            walrus_cid,
            witness_pubkeys: vector::empty(),
            witness_sigs: vector::empty(),
            expires,
        };

        transfer::share_object(task);
    }

    // Witness a task
    public entry fun witness_task(
        task: &mut Task,
        pubkey: vector<u8>,
        sig: vector<u8>,
        treasury: &mut Treasury,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Check not expired
        assert!(clock::timestamp_ms(clock) <= task.expires, E_EXPIRED);

        // Verify payload hash matches
        let computed_hash = keccak256(&task.payload);
        assert!(computed_hash == task.payload_hash, E_PAYLOAD_HASH_MISMATCH);

        // Verify Ed25519 signature
        assert!(
            ed25519::ed25519_verify(&sig, &pubkey, &task.payload),
            E_INVALID_SIGNATURE
        );

        // Check pubkey not already witnessed
        let i = 0;
        let len = vector::length(&task.witness_pubkeys);
        while (i < len) {
            assert!(vector::borrow(&task.witness_pubkeys, i) != &pubkey, E_DUPLICATE_WITNESS);
            i = i + 1;
        };

        // Add witness
        vector::push_back(&mut task.witness_pubkeys, pubkey);
        vector::push_back(&mut task.witness_sigs, sig);

        // If 3 witnesses reached, mint reward
        if (vector::length(&task.witness_pubkeys) == REQUIRED_WITNESSES) {
            let reward = coin::take(&mut treasury.balance, TASK_REWARD, ctx);
            transfer::public_transfer(reward, task.staker);
        };
    }

    // Update Walrus CID
    public entry fun commit_blob_cid(
        task: &mut Task,
        cid: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == task.staker, E_NOT_AUTHORIZED);
        task.walrus_cid = cid;
    }

    // Getters
    public fun get_witness_count(task: &Task): u64 {
        vector::length(&task.witness_pubkeys)
    }

    public fun get_staker(task: &Task): address {
        task.staker
    }

    public fun get_payload_hash(task: &Task): vector<u8> {
        task.payload_hash
    }

    public fun get_walrus_cid(task: &Task): vector<u8> {
        task.walrus_cid
    }

    public fun is_expired(task: &Task, clock: &Clock): bool {
        clock::timestamp_ms(clock) > task.expires
    }
}
