/* Copyright © 2022 Seneca Project Contributors, MIT License. */

function refer(this: any, options: any) {
  const seneca: any = this;

  seneca
    .fix("biz:refer")
    .message("create:entry", actCreateEntry)
    .message("accept:entry", actAcceptEntry)
    .message("reward:entry", actRewardEntry)
    .message("load:rules", actLoadRules)
    .prepare(prepare);

  async function actCreateEntry(this: any, msg: any) {
    const seneca = this;

    const entry = await seneca.entity("refer/entry").save$({
      user_id: msg.user_id,
      kind: msg.kind,
      email: msg.email,

      // TODO: use a longer key!
      key: this.util.Nid(), // unique key for this referral, used for validation
    });

    const occur = await seneca.entity("refer/occur").save$({
      user_id: msg.user_id,
      entry_kind: msg.kind,
      email: msg.email,
      entry_id: entry.id,
      kind: "create",
    });

    return {
      ok: true,
      entry,
      occur: [occur],
    };
  }

  async function actAcceptEntry(this: any, msg: any) {
    const seneca = this;

    const entryList = await seneca
      .entity("refer/entry")
      .list$({ user_id: msg.user_id });
    const entry = entryList[0];

    const occur = await seneca.entity("refer/occur").save$({
      user_id: msg.user_id,
      entry_kind: msg.kind,
      email: msg.email,
      entry_id: entry.id,
      kind: "accept",
    });

    return {
      ok: true,
      entry,
      occur: [occur],
    };
  }

  async function actRewardEntry(this: any, msg: any) {
    const seneca = this;

    const entryList = await seneca
      .entity("refer/entry")
      .list$({ user_id: msg.user_id });
    const entry = entryList[0];
    // let reward = await seneca
    //   .entity("refer/reward")
    //   .list$({ entry_id: entry.id });

    // console.log(reward);
    // if (reward) {
    //   reward = await seneca
    //     .entity("refer/reward")
    //     .list$({ entry_id: entry.id });
    //   reward = await seneca.entity("refer/reward").load$({
    //     count: reward.count++,
    //   });
    //
    //   return {
    //     ok: true,
    //     // entry,
    //     reward: [reward],
    //   };
    // }
    let reward = await seneca.entity("refer/reward").save$({
      entry_kind: entry.kind,
      entry_id: entry.id,
      kind: "reward",
      count: 1,
    });

    return {
      ok: true,
      // entry,
      reward: [reward],
    };
  }

  async function actLoadRules(this: any, msg: any) {
    const seneca = this;

    const rules = await seneca.entity("refer/rule").list$();

    // TODO: handle rule updates?
    // TODO: create a @seneca/rule plugin? later!

    for (let rule of rules) {
      if (rule.ent) {
        const ent = seneca.entity(rule.ent);
        const canon = ent.canon$({ object: true });
        const subpat = {
          role: "entity",
          cmd: rule.cmd,
          ...canon,
          out$: true,
        };

        seneca.sub(subpat, function (this: any, msg: any) {
          // TODO: match and 'where' fields
          if (msg.ent.kind === rule.where.kind) {
            // TODO: handle more than 1!
            const callmsg = { ...rule.call[0] };

            // TODO: use https://github.com/rjrodger/inks
            callmsg.toaddr = msg.ent.email;
            callmsg.fromaddr = "invite@example.com";

            this.act(callmsg);
          }
        });
      }
      // else ignore as not yet implemented
    }
  }

  async function prepare(this: any) {
    const seneca = this;
    await seneca.post("biz:refer,load:rules");
  }
}

type ReferOptions = {
  debug?: boolean;
};

// Default options.
const defaults: ReferOptions = {
  // TODO: Enable debug logging
  debug: false,
};

Object.assign(refer, { defaults });

export default refer;

if ("undefined" !== typeof module) {
  module.exports = refer;
}
