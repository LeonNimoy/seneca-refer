// Basic referral: sent email invite to a friend

// if a non-user, accepts a referral, one becomes a user
// if the non-user doesn't accept any invitation - the first one that is
// accepted, wins. So the other invites will change its status to lost

export default {
  print: false,
  pattern: 'biz:refer',
  allow: { missing: true },

  calls: [
    // User with id=u01 sends referral to friend alice@example.com
    // Creating:
    //   - refer/entry referral record
    //   - refer/occur event record
    //   - sent email to alice@example.com (mock/email record)
    // Email sending to be implemented with @seneca/mail later
    // NOTE: implementation is just hard-coded!
    {
      print: true,
      name: 'create-alice',
      pattern: 'create:entry', // call { biz:refer, create:entry, ...params }
      params: {
        user_id: 'u01',
        kind: 'standard', // avoid using 'type', 'kind' has fewer conflicts
        email: 'alice@example.com'
      },
      out: {
        ok: true,
        entry: {
          user_id: 'u01', // _id suffix for foreign keys
          kind: 'standard',
          email: 'alice@example.com'
        },
        occur: [
          {
            user_id: 'u01',
            entry_kind: 'standard',
            kind: 'create',
            email: 'alice@example.com'
          }
        ]
      }
    },

    // Print entire database
    // { print: true, pattern: 'biz:null,role:mem-store,cmd:dump' },

    // Validate the refer/entry exists and is correct
    {
      print: true,
      pattern: 'biz:null,role:entity,base:refer,name:entry,cmd:list',
      out: [
        {
          id: '`create-alice:out.entry.id`',
          user_id: 'u01',
          kind: 'standard',
          email: 'alice@example.com'
        }
      ]
    },

    // Validate the refer/occur exists and is correct
    {
      pattern: 'biz:null,role:entity,base:refer,name:occur,cmd:list',
      out: [
        {
          // back references, see: https://github.com/rjrodger/inks
          id: '`create-alice:out.occur[0].id`',
          entry_id: '`create-alice:out.entry.id`',
          entry_kind: 'standard',
          kind: 'create',
          email: 'alice@example.com'
        }
      ]
    },

    // Validate email was 'sent' (uses mock entity)
    {
      pattern: 'biz:null,role:entity,base:mock,name:email,cmd:list',
      out: [
        {
          toaddr: 'alice@example.com',
          fromaddr: 'invite@example.com',
          kind: 'refer',
          code: 'invite'
        }
      ]
    },

    // Accept the referral
    {
      print: true,
      name: 'accept-alice',
      pattern: 'accept:entry',
      params: {
        key: '`create-alice:out.entry.key`',
        user_id: 'u01'
      },
      out: {
        ok: true,
        entry: {
          user_id: 'u01',
          kind: 'standard',
          email: 'alice@example.com'
        },
        occur: [
          {
            user_id: 'u01',
            kind: 'accept'
          }
        ]
      }
    },
    // Validate new refer/occur record
    {
      print: true,
      pattern: 'biz:null,role:entity,base:refer,name:occur,cmd:load',
      params: { q: { kind: 'accept' } },
      out: {
        entry_id: '`create-alice:out.entry.id`',
        user_id: 'u01',
        kind: 'accept'
      }
    },

    // Validate new refer/reward updated
    {
      print: true,
      pattern: 'biz:null,role:entity,base:refer,name:reward,cmd:load',
      params: { q: { entry_id: '`create-alice:out.entry.id`' } },
      out: {
        entry_id: '`accept-alice:out.entry.id`',
        entry_kind: 'standard',
        kind: 'accept',
        count: 1 // alice@example.com accepted
      }
    },

    // Another user send a referral to alice@example.com

    // User with id=u02 sends referral to friend alice@example.com
    // Creating:
    //   - another refer/entry referral record
    //   - another refer/occur event record
    //   - sent email to alice@example.com (mock/email record)
    {
      print: true,
      name: 'create-alice2',
      pattern: 'create:entry', // call { biz:refer, create:entry, ...params }
      params: {
        user_id: 'u02',
        kind: 'standard', // avoid using 'type', 'kind' has fewer conflicts
        email: 'alice@example.com'
      },
      out: {
        ok: true,
        entry: {
          user_id: 'u02', // _id suffix for foreign keys
          kind: 'standard',
          email: 'alice@example.com'
        },
        occur: [
          {
            user_id: 'u02',
            entry_kind: 'standard',
            kind: 'create',
            email: 'alice@example.com'
          }
        ]
      }
    },

    // Validate that both refer/entry exists, and they are correct
    {
      print: true,
      pattern: 'biz:null,role:entity,base:refer,name:entry,cmd:list',
      out: [
        {
          id: '`create-alice:out.entry.id`',
          user_id: 'u01',
          kind: 'standard',
          email: 'alice@example.com'
        },
        {
          id: '`create-alice2:out.entry.id`',
          user_id: 'u02',
          kind: 'standard',
          email: 'alice@example.com'
        }
      ]
    }
  ]
}

/* ADDITIONAL SCENARIOS
 * Another user send a referral to alice@example.com
 *   - before acceptance
 *   - after acceptance
 */
