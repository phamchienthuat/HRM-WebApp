import { NativeDateAdapter, MatDateFormats } from '@angular/material/core';

export class CustomDateAdapter extends NativeDateAdapter {

    override locale: string = window.localStorage.getItem('lang') || 'en';

    override format(date: Date, displayFormat: Object): string {
        let day = date.getDate().toString().padStart(2, '0');
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let year = date.getFullYear();

        // Return the date in the format you want
        return `${day}/${month}/${year}`;
    }

    // Override this method to set the language of your choice
    override getFirstDayOfWeek(): number {
        return 1; // Monday
    }

    // Override this method to set the month names of your choice
    override getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
        if (this.locale === 'vn') {
            if (style === 'long') {
                return ['Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu', 'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'];
            } else {
                return ['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6', 'Thg 7', 'Thg 8', 'Thg 9', 'Thg 10', 'Thg 11', 'Thg 12'];
            }
        }
        return super.getMonthNames(style);

    }

    // Override this method to set the day names of your choice
    override getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
        if (this.locale === 'vn') {
            if (style === 'long') {
                return ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
            } else {
                return ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            }
        }
        return super.getDayOfWeekNames(style);
    }
}
export const CUSTOM_DATE_FORMATS: MatDateFormats = {
    parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
    display: {
        dateInput: 'input',
        monthYearLabel: { year: 'numeric', month: 'short' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' },
    }
};