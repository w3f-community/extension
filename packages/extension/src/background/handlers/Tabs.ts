// Copyright 2019 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { MessageAuthorize, MessageExtrinsicSign, MessageExtrinsicSignResponse, MessageTypes, PayloadTypes, MessageRpcSend, MessageRpcSendResponse, MessageRpcSendSubscribe, ResponseTypes } from '../types';

import keyring from '@polkadot/ui-keyring';
import accountsObservable from '@polkadot/ui-keyring/observable/accounts';
import { assert } from '@polkadot/util';

import State from './State';
import { createSubscription, unsubscribe } from './subscriptions';

export interface Account {
  address: string;
  name?: string;
}
export type Accounts = Account[];

function transformAccounts (accounts: SubjectInfo): Accounts {
  return Object.values(accounts).map(({ json: { address, meta: { name } } }): Account => ({
    address, name
  }));
}

export default class Tabs {
  private state: State;

  public constructor (state: State) {
    this.state = state;
  }

  private authorize (url: string, request: MessageAuthorize): Promise<boolean> {
    return this.state.authorizeUrl(url, request);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private accountsList (url: string): Accounts {
    return transformAccounts(accountsObservable.subject.getValue());
  }

  // FIXME This looks very much like what we have in Extension
  private accountsSubscribe (url: string, id: string, port: chrome.runtime.Port): boolean {
    const cb = createSubscription(id, port);
    const subscription = accountsObservable.subject.subscribe((accounts: SubjectInfo): void =>
      cb(transformAccounts(accounts))
    );

    port.onDisconnect.addListener((): void => {
      unsubscribe(id);
      subscription.unsubscribe();
    });

    return true;
  }

  private extrinsicSign (url: string, request: MessageExtrinsicSign): Promise<MessageExtrinsicSignResponse> {
    const { address } = request;
    const pair = keyring.getPair(address);

    assert(pair, 'Unable to find keypair');

    return this.state.signQueue(url, request);
  }

  private rpcSend (url: string, request: MessageRpcSend, port: chrome.runtime.Port): Promise<MessageRpcSendResponse> {
    const { method, params } = request;

    return this.state.proxySend(method, params || [], port);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private rpcSendSubscribe (url: string, request: MessageRpcSendSubscribe, sendMessage: (message: any) => void, port: chrome.runtime.Port): Promise<MessageRpcSendResponse> {
    const { type, method, params } = request;

    return this.state.proxySubscribe(type, method, params || [], (_, notification): void => {
      if (notification) {
        sendMessage(notification);
      }
    }, port);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async handle<TMessageType extends MessageTypes> (id: string, type: TMessageType, request: PayloadTypes[TMessageType], url: string, port: chrome.runtime.Port, sendMessage: (message: any) => void): Promise<ResponseTypes[TMessageType]> {
    if (type !== 'authorize.tab') {
      this.state.ensureUrlAuthorized(url);
    }

    switch (type) {
      case 'authorize.tab':
        return this.authorize(url, request as MessageAuthorize);

      case 'accounts.list':
        return this.accountsList(url);

      case 'accounts.subscribe':
        return this.accountsSubscribe(url, id, port);

      case 'extrinsic.sign':
        return this.extrinsicSign(url, request as MessageExtrinsicSign);

      case 'rpc.send':
        return this.rpcSend(url, request as MessageRpcSend, port);

      case 'rpc.sendSubscribe':
        return this.rpcSendSubscribe(url, request as MessageRpcSendSubscribe, sendMessage, port);

      default:
        throw new Error(`Unable to handle message of type ${type}`);
    }
  }
}
