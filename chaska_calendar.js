/*
Version: 2.0 (2019-04-02)
usage:
	$('.my-calendar').ChaskaCalendar();
method:
	last month: $('.my-calendar').ChaskaCalendar('last');
	next month: $('.my-calendar').ChaskaCalendar('next');

*/
jQuery(function($) {

	$.fn.ChaskaCalendar = function(method) {

		switch (method) {
			default: law_calendar.init(this); break;
			case 'next': law_calendar.next(this); break;
			case 'previous': law_calendar.previous(this); break;
			case 'today': law_calendar.today(this); break;
		}

	}

	var law_calendar = {

		string: {
			today: 'Go to Today',
			weekday: {
				sun: 'Sun',
				mon: 'Mon',
				tue: 'Tue',
				wed: 'Wed',
				thu: 'Thu',
				fri: 'Fri',
				sat: 'Sat'
			},
			month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
		},

		init: function(calendar) {

			var that = this;

			// create calendar table
			var d = 0;
			var days = '';
			for (r=0; r<6; r++) {
				days += '<tr class="day-row">';
				for (c=0; c<7; c++) {
					if (c == 0) {
						days += '<td class="daybox sun daybox-'+d+'" data-weekday="'+c+'"><div class="day-label"></div><div class="day-content"></div></td>';
					} else {
						days += '<td class="daybox daybox-'+d+'" data-weekday="'+c+'"><div class="day-label"></div><div class="day-content"></div></td>';
					}
					d++;
				}
				days += '</tr>';
			}
			var table = '<table class="calendar-table">' +
						'	<thead>' +
						'		<tr class="month-row">' +
						'			<th class="last-button"><a href="javascript:"></a></th>' +
						'			<th colspan="5" class="month-name"></th>' +
						'			<th class="next-button"><a href="javascript:"></a></th>' +
						'		</tr>' +
						'	</thead>' +
						'	</tbody>' +
						'		<tr class="weekday-row">' +
						'			<td class="sun strong">'+that.string.weekday.sun+'</td>' +
						'			<td class="mon strong">'+that.string.weekday.mon+'</td>' +
						'			<td class="tue strong">'+that.string.weekday.tue+'</td>' +
						'			<td class="wed strong">'+that.string.weekday.wed+'</td>' +
						'			<td class="thu strong">'+that.string.weekday.thu+'</td>' +
						'			<td class="fri strong">'+that.string.weekday.fri+'</td>' +
						'			<td class="sat strong">'+that.string.weekday.sat+'</td>' +
						'		</tr>' +
						'		' + days +
						'	</tbody>' +
						'	<tfoot><tr><td colspan="7" class="today-button">'+that.string.today+'</td></tr></tfoot>' +
						'</table>';
			calendar.html(table);

			// fill this month
			var today = new Date();
			law_calendar.fill_day_boxes(calendar, today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate());

		},

		clear_day_boxes: function(calendar) {
			calendar.find('table.calendar-table .daybox').each(function() {
				$(this)
                    .removeClass('past-day')
                    .removeClass('today')
                    .removeClass('this-month')
                    .removeClass('last-month')
                    .removeClass('next-month')
                    .removeClass('first-day')
                    .removeClass('last-day');
				$(this).find('.day-label').text('');
			});
		},

		fill_day_boxes: function(calendar, date) {

			var that = this;
			that.clear_day_boxes(calendar);

			var today_date = new Date(date);
			calendar.find('table.calendar-table').attr('data-current-date', date);
			calendar.find('table.calendar-table .month-row .month-name').text(that.string.month[today_date.getMonth()]+' '+today_date.getFullYear());

			var this_month_date = new Date(today_date.getFullYear()+'/'+(today_date.getMonth()+1)+'/'+'1');
			var start = this_month_date.getDay();
			for (day=1; day<=31; day++) {
				var this_date = this_month_date.getFullYear()+'/'+(this_month_date.getMonth()+1)+'/'+day;
				if (that.check_valid_date(day+'/'+(this_month_date.getMonth()+1)+'/'+this_month_date.getFullYear())) {
					today_for_check = new Date();
					if (this_date == (today_for_check.getFullYear()+'/'+(today_for_check.getMonth()+1)+'/'+today_for_check.getDate())) {
						calendar.find('.calendar-table td.daybox-'+start).addClass('today');
					}
					if (new Date(this_date+' 00:00:00') < new Date(today_for_check.getFullYear()+'/'+(today_for_check.getMonth()+1)+'/'+today_for_check.getDate()+' 00:00:00')) {
						calendar.find('.calendar-table td.daybox-'+start).addClass('past-day');
					}
					calendar.find('.calendar-table td.daybox-'+start).attr('data-date', this_month_date.getFullYear()+'-'+that.padLeft(this_month_date.getMonth()+1,2)+'-'+that.padLeft(day,2));
					calendar.find('.calendar-table td.daybox-'+start).addClass('this-month');
					if (day == 1) { calendar.find('.calendar-table td.daybox-'+start).addClass('first-day'); }
					calendar.find('.calendar-table td.daybox-'+start+' .day-label').text(day);
					start++;
				}
			}
            calendar.find('.calendar-table td.daybox-'+(start-1)).addClass('last-day');
			// fill next month
			var next_month_date = new Date(date);
			next_month_date.setMonth(next_month_date.getMonth() + 1);
			next_month_date = new Date(next_month_date.getFullYear()+'/'+(next_month_date.getMonth()+1)+'/'+'1');
			for (i=start; i<42; i++) {
				today_for_check = new Date();
				if ((next_month_date.getDate()+'/'+(next_month_date.getMonth()+1)+'/'+next_month_date.getFullYear()) == (today_for_check.getDate()+'/'+(today_for_check.getMonth()+1)+'/'+today_for_check.getFullYear())) {
					calendar.find('.calendar-table td.daybox-'+i).addClass('today');
				}
				calendar.find('.calendar-table td.daybox-'+i).attr('data-date', next_month_date.getFullYear()+'-'+that.padLeft(next_month_date.getMonth()+1,2)+'-'+that.padLeft(next_month_date.getDate(),2));
				calendar.find('.calendar-table td.daybox-'+i).addClass('next-month');
				calendar.find('.calendar-table td.daybox-'+i+' .day-label').text(next_month_date.getDate());
				next_month_date.setDate(next_month_date.getDate() + 1);
			}
			// fill last month
			var today_date = new Date(date);
			var this_month_date = new Date(today_date.getFullYear()+'/'+(today_date.getMonth()+1)+'/'+'1');
			var start = this_month_date.getDay();
			start--;
			for (i=0; i<=start; i++) {
				today_for_check = new Date();
				if ((this_month_date.getDate()+'/'+(this_month_date.getMonth()+1)+'/'+this_month_date.getFullYear()) == (today_for_check.getDate()+'/'+(today_for_check.getMonth()+1)+'/'+today_for_check.getFullYear())) {
					calendar.find('.calendar-table td.daybox-'+(start-i)).addClass('today');
				}
				this_month_date.setDate(this_month_date.getDate() - 1)
				calendar.find('.calendar-table td.daybox-'+(start-i)).attr('data-date', this_month_date.getFullYear()+'-'+that.padLeft(this_month_date.getMonth()+1,2)+'-'+that.padLeft(this_month_date.getDate(),2));
				calendar.find('.calendar-table td.daybox-'+(start-i)).addClass('last-month');
				calendar.find('.calendar-table td.daybox-'+(start-i)+' .day-label').text(this_month_date.getDate());
			}

		},

		previous: function(calendar) {

			var that = this;
			var date = new Date(calendar.find('table.calendar-table').attr('data-current-date'));
			date.setMonth(date.getMonth() - 1);
			that.fill_day_boxes(calendar, date.getFullYear()+'/'+(date.getMonth()+1)+'/1');

		},

		next: function(calendar) {

			var that = this;
			var date = new Date(calendar.find('table.calendar-table').attr('data-current-date'));
			date.setMonth(date.getMonth() + 1);
			that.fill_day_boxes(calendar, date.getFullYear()+'/'+(date.getMonth()+1)+'/1');

		},

		today: function(calendar) {

			var that = this;
			var date = new Date();
			that.fill_day_boxes(calendar, date.getFullYear()+'/'+(date.getMonth()+1)+'/1');

		},

		check_valid_date: function(s) {

			var bits = s.split('/');
			var d = new Date(bits[2], bits[1] - 1, bits[0]);
			return d && (d.getMonth() + 1) == bits[1];

		},

		padLeft: function(nr, n, str) {
			return Array(n-String(nr).length+1).join(str||'0')+nr;
		}

	}

}(jQuery));