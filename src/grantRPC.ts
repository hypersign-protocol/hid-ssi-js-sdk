import { GenericAuthorization } from './generated/authz/authz';
import { BasicAllowance } from './generated/feegrant/feegrant';
import { Coin } from './generated/cosmos/coin';

import { HIDClient } from './hid/client'
import { SigningStargateClient } from "@cosmjs/stargate";
import Utils from './utils';


export async function grantAuthorization(
    granter: string,
    grantee: string,
    didTypeUrl: string,
    ): Promise<Object> {
    
    const txMessage = {
        typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
        value: {
            granter,
            grantee,
            grant: {
                authorization: {
                    typeUrl: "/cosmos.authz.v1beta1.GenericAuthorization",
                    value: GenericAuthorization.encode(
                        GenericAuthorization.fromPartial({
                            msg: didTypeUrl
                        })
                    ).finish()
                }
            }
        },
    };

    const fee = Utils.getFee()
    const hidClient: SigningStargateClient = HIDClient.getHidClient();
    const txResult = await hidClient.signAndBroadcast(HIDClient.getHidWalletAddress(), [txMessage], fee);
    return txResult
}

export async function grantFeeAllowance(
    granter: string,
    grantee: string,
    spendLimitAmount: { denom: string, amount: string }
    ): Promise<Object> {
    
    const txMessage = {
        typeUrl: "/cosmos.feegrant.v1beta1.MsgGrantAllowance",
        value: {
            granter,
            grantee,
            allowance: {
                typeUrl: "/cosmos.feegrant.v1beta1.BasicAllowance",
                value: BasicAllowance.encode(
                    BasicAllowance.fromPartial({
                        spend_limit: [
                            Coin.fromPartial(spendLimitAmount)
                        ]
                    })
                ).finish()
            }
        },
    };

    const fee = Utils.getFee()
    const hidClient: SigningStargateClient = HIDClient.getHidClient();
    const txResult = await hidClient.signAndBroadcast(HIDClient.getHidWalletAddress(), [txMessage], fee);
    return txResult
}