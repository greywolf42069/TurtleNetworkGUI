(function () {
    /* eslint-disable */
    'use strict';

    const MODULES_MAP = {
        'ts-utils': 'tsUtils',
        '@turtlenetwork/bignumber': 'BigNumber',
        '@waves/bignumber': 'BigNumber',
        'ts-api-validator': 'tsApiValidator',
        '@waves/parse-json-bignumber': 'parseJsonBignumber',
        'papaparse': 'Papa',
        'waves-api': 'WavesAPI',
        'identity-img': 'identityImg',
        '@waves/data-entities': 'dataEntities',
        '@turtlenetwork/data-entities': 'dataEntities',
        '@turtlenetwork/waves-transactions': 'WavesTransactions',
        '@waves/waves-crypto': 'WavesCrypto',
        '@turtlenetwork/ledger/dist/transport-u2f': 'TransportU2F',
        '@ledgerhq/hw-transport-u2f': 'TransportU2F',
        '@turtlenetwork/ledger': 'WavesLedgerJs',
        '@turtlenetwork/signature-adapter': 'turtlenetworkSignatureAdapter',
        'ramda': 'R',
        'data-service': 'ds',
        'handlebars': 'Handlebars',
        '@waves/waves-browser-bus': 'bus',
        'worker-wrapper': 'workerWrapper',
        '@waves/oracle-data': 'OracleDataProvider',
        'jquery': '$',
        'i18next': 'i18next'
    };

    function getModule(require) {
        return function (name) {
            if (name in MODULES_MAP && Object.prototype.hasOwnProperty.call(MODULES_MAP, name)) {
                return tsUtils.get(window, MODULES_MAP[name]);
            } else if (require) {
                return require(name);
            } else {
                throw new Error(`Not loaded module with name "${name}`);
            }
        };
    }

    window.require = getModule(window.require);
})();
