(function () {
    'use strict';

    /**
     * @param {typeof Base} Base
     * @param {User} user
     * @param {$rootScope.Scope} $scope
     * @return {Sign}
     */
    const controller = function (Base, user, $scope) {

        class Sign extends Base {

            /**
             * @return {boolean}
             */
            get isShown() {
                return user.userType && user.userType !== 'seed' && this.signable;
            }

            /**
             * @type {string}
             */
            userType = user.userType;
            /**
             * @type {boolean}
             */
            isLedger = user.userType === 'ledger';
            /**
             * @type {boolean}
             */
            isKeeper = user.userType === 'TurtleShell';
            /**
             * @type {boolean}
             */
            signPending = false;
            /**
             * @type {Signable}
             */
            signable = null;
            /**
             * @type {boolean}
             */
            signError = false;
            /**
             * @type {string}
             */
            id = '';
            /**
             * @type {boolean}
             */
            hideId = false;
            /**
             * @type {number}
             */
            keeperError = 0

            constructor() {
                super();

                this.observe('signable', this._onChangeSignable);
            }

            trySign() {
                this.signError = false;
                this.signPending = true;
                this.keeperError = 0;
                return this.signable.addMyProof()
                    .then(signature => {
                        this.signPending = false;
                        this.onSuccess({ signature });
                    })
                    .catch((e) => {
                        this.signPending = false;
                        this.signError = true;

                        if (this.isKeeper && e && e.code === 5 && e.msg.includes('another active account')) {
                            this.keeperError = 1;
                        }

                    })
                    .then(() => {
                        $scope.$apply();
                    });
            }

            cancel() {
                this.signError = false;
                this.signPending = false;
                this.onCancel();
            }

            /**
             * @private
             */
            _onChangeSignable() {
                const signable = this.signable;

                if (signable) {
                    signable.getId().then(id => {
                        this.id = id;
                        $scope.$apply();
                    });
                    this.trySign();
                } else {
                    this.signPending = false;
                    this.id = '';
                }
            }

        }

        return new Sign();
    };

    controller.$inject = ['Base', 'user', '$scope'];

    angular.module('app.ui').component('wSign', {
        scope: false,
        bindings: {
            signable: '<',
            hideId: '<',
            onSuccess: '&',
            onCancel: '&'
        },
        templateUrl: 'modules/ui/directives/sign/sign.html',
        controller
    });
})();
