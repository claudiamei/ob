/* global describe, it, beforeEach, inject, expect */

describe("Unit Testing Examples", function() {

	beforeEach(angular.mock.module('amelia-ui.kpi-boxes'));

	it('has a KPI number filter', inject(function($filter) {
        expect($filter('kpiNumber')).not.toBeNull();
    }));

    it("should return a number with the right suffix ", inject(function (kpiNumberFilter) {
        expect(kpiNumberFilter(1)).toBe('1');
        expect(kpiNumberFilter(12)).toBe('12');
        expect(kpiNumberFilter(123)).toBe('123');
        expect(kpiNumberFilter(1234)).toBe('1.23k');
        expect(kpiNumberFilter(1234567)).toBe('1.23m');
        expect(kpiNumberFilter(1236567)).toBe('1.24m');
        expect(kpiNumberFilter(1234567890)).toBe('1.23b');
        expect(kpiNumberFilter(1234567890123)).toBe('1.23t');
        expect(kpiNumberFilter(134222.589, 2, 6, true)).toBe('134,223');
        expect(kpiNumberFilter(134222.589, 2, 6, false)).toBe('134,222.59');
        expect(kpiNumberFilter(134222, 2, 5, true)).toBe('134.22k');
        expect(kpiNumberFilter(1342222, 2, 6, true)).toBe('1.34m');
    }));

    it("should round to the right number ", inject(function (kpiNumberFilter) {
        expect(kpiNumberFilter(1)).toBe('1');
        // expect(kpiNumberFilter(999999)).toBe('1m');
    }));

});