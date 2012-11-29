export module m2 {
    export import mExported = module("mExported");

    module Internal_M1 {
        export var c1 = new mExported.me.class1;
        export function f1() {
            return new mExported.me.class1();
        }
        export var x1 = mExported.me.x;

        export class class1 extends mExported.me.class1 {
        }

        var c2 = new mExported.me.class1;
        function f2() {
            return new mExported.me.class1();
        }
        var x2 = mExported.me.x;
        class class2 extends mExported.me.class1 {
        }
    }

    export module Internal_M2 {
        export var c1 = new mExported.me.class1;
        export function f1() {
            return new mExported.me.class1();
        }
        export var x1 = mExported.me.x;

        export class class1 extends mExported.me.class1 {
        }

        var c2 = new mExported.me.class1;
        function f2() {
            return new mExported.me.class1();
        }
        var x2 = mExported.me.x;
        class class2 extends mExported.me.class1 {
        }
    }

    import mNonExported = module("mNonExported");
    module Internal_M3 {
        export var c3 = new mNonExported.mne.class1;
        export function f3() {
            return new mNonExported.mne.class1();
        }
        export var x3 = mNonExported.mne.x;

        export class class3 extends mNonExported.mne.class1 {
        }

        var c4 = new mNonExported.mne.class1;
        function f4() {
            return new mNonExported.mne.class1();
        }
        var x4 = mNonExported.mne.x;

        class class4 extends mNonExported.mne.class1 {
        }
    }

    export module Internal_M4 {
        export var c3 = new mNonExported.mne.class1;
        export function f3() {
            return new mNonExported.mne.class1();
        }
        export var x3 = mNonExported.mne.x;

        export class class3 extends mNonExported.mne.class1 {
        }

        var c4 = new mNonExported.mne.class1;
        function f4() {
            return new mNonExported.mne.class1();
        }
        var x4 = mNonExported.mne.x;

        class class4 extends mNonExported.mne.class1 {
        }
    }
}