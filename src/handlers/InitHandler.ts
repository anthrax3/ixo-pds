import { Request } from "../handlers/Request";
import { create } from "domain";
import { Config, IConfigModel, ConfigSchema } from '../model/project/Config';
import { IConfig } from '../model/project/IConfig';
import transactionLog from '../service/TransactionLogService'
import capabilities from "../service/CapabilitiesService";
import {SovrinUtils} from '../crypto/SovrinUtils';
import config from "../service/ConfigurationService";
import { ICapabilitiesModel } from "../model/project/Capabilities";
import { TransactionError } from "../error/TransactionError";
import { ITransactionModel } from "../model/project/Transaction";


declare var Promise: any;

export class InitHandler {

    initPds = (args: any) => {
        var request = new Request(args);
        return new Promise((resolve: Function, reject: Function) => {
            var sovrinUtils = new SovrinUtils();
            var mnemonic = sovrinUtils.generateBip39Mnemonic();
            var sovrinWallet = sovrinUtils.generateSdidFromMnemonic(mnemonic);
            request.did = String("did:sov:" + sovrinWallet.did);

            config.createConfig(request).then ((configs: IConfigModel) => {
                capabilities.createCapability(request.capabilities).then((capability: ICapabilitiesModel) => {
                    capabilities.addCapabilities(request.did, 'CreateProject').then((capability: ICapabilitiesModel) => {
                    var signedpayload = sovrinUtils.signDocument(sovrinWallet, request.payload);
                        request.signature = signedpayload;
                        transactionLog.createTransaction(request.payload, 
                            request.signature.type, 
                            request.signature.signatureValue,
                            sovrinWallet.encryptionPublicKey).then((txn: ITransactionModel) => {
                                resolve({
                                    did: request.did,
                                    signatureType: request.signature.type,
                                    seed: mnemonic
                                    }) 
                            });  
                    });             
                })
            })
        })
    }
}