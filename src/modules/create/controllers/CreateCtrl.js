(function () {
    'use strict';

    /**
     * @param {typeof Base} Base
     * @param {ng.IScope} $scope
     * @param {ng.IQService} $q
     * @param {*} $state
     * @param {User} user
     * @param {ModalManager} modalManager
     * @param {ISeedService} seedService
     * @return {CreateCtrl}
     */
    const controller = function (Base, $scope, $q, $state, user, modalManager, seedService) {

        const PATH = 'modules/create/templates';
        const ORDER_LIST = [
            'createAccount',
            'createAccountData'
        ];

        const STATE_HASH = {
            CREATE_ACCOUNT: 0,
            CREATE_ACCOUNT_DATA: 1,
            SHOW_NO_BACKUP_NOW_MONEY: 2,
            BACKUP: 3,
            CONFIRM_BACKUP: 4
        };

        class CreateCtrl extends Base {

            constructor() {
                super($scope);

                this.invitationStep = 0;
                this.stepIndex = 0;
                this.name = '';
                this.seed = '';
                this.address = '';
                this.seedList = [];
                this.seedIsValid = false;
                this.seedConfirmWasFilled = false;
                this.saveUserData = true;

                this.resetAddress();
            }

            onSeedConfirmFulfilled(isValid) {
                this.seedIsValid = isValid;
                this.seedConfirmWasFilled = true;

                this.observeOnce('stepIndex', this.clearSeedConfirm);
            }

            seedOnTouch() {
                this.seedConfirmWasFilled = false;
            }

            clearSeedConfirm() {
                seedService.clear.dispatch();
                this.seedIsValid = false;
                this.seedConfirmWasFilled = false;
            }

            setActiveSeed(item) {
                const old = tsUtils.find(this.seedList, { active: true });
                if (old) {
                    old.active = false;
                }
                item.active = true;
                this.seed = item.seed;
                this.address = item.address;
            }

            getStepUrl() {
                return `${PATH}/${ORDER_LIST[this.stepIndex]}.html`;
            }

            create() {

                return this._create(true);
            }

            createWithoutBackup() {

                return this._create(false);
            }

            clickCopySeed() {
            }

            /**
             * @param {number} [index]
             */
            next(index) {

                if (!index) {
                    index = this.stepIndex + 1;
                }

                if (index < 0) {
                    index = this.stepIndex + index;
                }

                if (index === STATE_HASH.CREATE_ACCOUNT_DATA) {
                }
                if (this.stepIndex === STATE_HASH.CREATE_ACCOUNT_DATA && index > this.stepIndex) {
                }
                if (index === STATE_HASH.SHOW_NO_BACKUP_NOW_MONEY) {
                }
                if (this.stepIndex === STATE_HASH.SHOW_NO_BACKUP_NOW_MONEY && index > this.stepIndex) {
                }
                if (index === STATE_HASH.BACKUP) {
                }
                if (this.stepIndex === STATE_HASH.BACKUP && index > this.stepIndex) {
                }
                if (index === STATE_HASH.CONFIRM_BACKUP) {
                }

                if (!ORDER_LIST[index]) {
                    throw new Error('Wrong order list index!');
                } else {
                    return this.checkNext()
                        .then(() => {
                            this.stepIndex = index;
                            if (index === STATE_HASH.BACKUP) {
                            }
                            if (index === STATE_HASH.CONFIRM_BACKUP) {
                            }
                        });
                }
            }

            nextInvitationStep() {
                this.invitationStep += 1;
            }

            checkNext() {
                const step = ORDER_LIST[this.stepIndex];
                if (step === 'noBackupNoMoney') {
                    return this.showBackupWarningPopup()
                        .then(() => {
                        });
                }
                return $q.when();
            }

            resetAddress() {
                const list = [];
                for (let i = 0; i < 5; i++) {
                    const phrase = ds.Seed.create().phrase;
                    const seedData = new ds.Seed(phrase, window.WavesApp.network.code);
                    list.push({ seed: seedData.phrase, address: seedData.address });
                }

                this.setActiveSeed(list[0]);
                this.seedList = list;
            }

            showBackupWarningPopup() {
                return modalManager.showCustomModal({
                    templateUrl: 'modules/create/templates/noBackupNoMoney.modal.html',
                    clickOutsideToClose: false,
                    escapeToClose: false
                });
            }

            /**
             * @param hasBackup
             * @return {Promise}
             * @private
             */
            _create(hasBackup) {
                const newUser = {
                    userType: 'seed',
                    networkByte: WavesApp.network.code.charCodeAt(0),
                    name: this.name,
                    seed: this.seed
                };

                return user.create(newUser, hasBackup).then(() => {
                    $state.go(user.getActiveState('wallet'));
                });
            }

        }

        return new CreateCtrl();
    };

    controller.$inject = [
        'Base', '$scope', '$q', '$state', 'user', 'modalManager', 'seedService'
    ];

    angular.module('app.create').controller('CreateCtrl', controller);
})();
