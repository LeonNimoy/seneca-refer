/* Copyright © 2022 Seneca Project Contributors, MIT License. */

import Seneca from 'seneca'
import SenecaMsgTest from 'seneca-msg-test'
// import { Maintain } from '@seneca/maintain'

import ReferDoc from '../src/refer-doc'
import Refer from '../src/refer'

import BasicMessages from './standard/basic.messages'
import LimitMessages from './standard/limit.messages'
import MultiMessages from './standard/multi.messages'
import ConflictMessages from './standard/conflict.messages'
import SpecialMessages from './special/special.messages'
import SpecialLimitMessages from './special/special.limit.messages'

describe('refer', () => {
  test('happy', async () => {
    expect(ReferDoc).toBeDefined()
    const seneca = Seneca({ legacy: false })
      .test()
      .use('promisify')
      .use('entity')
      .use(Refer)
    await seneca.ready()
  })

  // Use seneca-msg-test for the referral scenarios

  test('basic.messages', async () => {
    const seneca = await makeSeneca()
    await SenecaMsgTest(seneca, BasicMessages)()
  })

  // Use seneca-msg-test to test referrals limit

  test('limit.messages', async () => {
    const seneca = await makeSeneca()
    await SenecaMsgTest(seneca, LimitMessages)()
  })

  // Use seneca-msg-test for multiple referrals

  test('multi.messages', async () => {
    const seneca = await makeSeneca()
    await SenecaMsgTest(seneca, MultiMessages)()
  })

  // Use seneca-msg-test for conflict referrals

  test('conflict.messages', async () => {
    const seneca = await makeSeneca()
    await SenecaMsgTest(seneca, ConflictMessages)()
  })

  // Use seneca-msg-test for special referrals

  test('special.messages', async () => {
    const seneca = await makeSeneca()
    await SenecaMsgTest(seneca, SpecialMessages)()
  })

  // Use seneca-msg-test to test special referrals limit

  test('special.limit.messages', async () => {
    const seneca = await makeSeneca()
    await SenecaMsgTest(seneca, SpecialLimitMessages)()
  })

  // test('maintain', Maintain)
})

async function makeSeneca() {
  const seneca = Seneca({ legacy: false })
    .test()
    .use('promisify')
    .use('entity')
    .use('entity-util', { when: { active: true } })

  await makeBasicRules(seneca)

  seneca.use(Refer)

  await makeMockActions(seneca)

  await seneca.ready()

  // print all message patterns
  // console.log(seneca.list())

  return seneca
}

async function makeBasicRules(seneca: any) {
  await seneca.entity('refer/rule').save$({
    ent: 'refer/occur',
    cmd: 'save',
    where: { kind: 'create' },
    call: [
      {
        sys: 'email',
        send: 'email',
        fromaddr: '`config:sender.invite.email`',
        subject: '`config:sender.invite.subject`',
        toaddr: '`occur:sender.invite.subject`',
        code: 'invite',
        kind: 'refer',
      },
    ],
  })

  await seneca.entity('refer/rule').save$({
    ent: 'refer/occur',
    cmd: 'save',
    where: { kind: 'accept', entry_kind: 'standard' },
    call: [
      {
        kind: 'accept',
        award: 'incr',
        field: 'count',
        limit: 3,
        give: 'award',
        biz: 'refer',
      },
    ],
  })

  await seneca.entity('refer/rule').save$({
    ent: 'refer/occur',
    cmd: 'save',
    where: { kind: 'accept', entry_kind: 'special' },
    call: [
      {
        kind: 'accept',
        award: 'incr',
        field: 'count',
        limit: 10,
        give: 'award',
        biz: 'refer',
      },
    ],
  })

  await seneca.entity('refer/rule').save$({
    ent: 'refer/reward',
    cmd: 'save',
    where: { kind: 'lost' },
    call: [
      {
        lost: 'entry',
        biz: 'refer',
      },
    ],
  })
}

async function makeMockActions(seneca: any) {
  seneca.message('sys:email,send:email', async function (this: any, msg: any) {
    this.entity('mock/email').save$({
      toaddr: msg.toaddr,
      fromaddr: msg.fromaddr,
      subject: msg.subject,
      kind: msg.kind,
      code: msg.code,
      what: 'sent',
    })
  })
}
