<template>
  <!-- The main wrapper for the calendar component -->
  <div class="calendar-wrapper">
    <div class="calendar-container">
      <!-- Header section: Navigation buttons and current month/year display -->
      <div class="calendar-header">
        <!-- Button to navigate to the previous month -->
        <button class="calendar-nav-btn" @click="previousMonth" :disabled="isPreviousMonthDisabled">
          <span class="calendar-nav-arrow">&larr;</span>
        </button>
        <!-- Displays the current month and year -->
        <h3 class="calendar-title">{{ monthNames[currentMonth] }} {{ currentYear }}</h3>
        <!-- Button to navigate to the next month -->
        <button class="calendar-nav-btn" @click="nextMonth">
          <span class="calendar-nav-arrow">&rarr;</span>
        </button>
      </div>

      <!-- Calendar body: Days and weekdays display -->
      <div class="calendar-body">
        <!-- Weekdays header (e.g., Sun, Mon, ...) -->
        <div class="calendar-weekdays">
          <span v-for="day in weekDays" :key="day" class="weekday">{{ day }}</span>
        </div>

        <!-- Calendar days for the current month -->
        <div class="calendar-days">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            :class="getDayClasses(day)"
            @click="handleDayClick(day)"
          >
            <!-- Displays the day number if the day exists -->
            <span v-if="day" class="day-number">{{ day.getUTCDate() }}</span>
            <!-- Status indicators for each day (e.g., unavailable, selected) -->
            <div v-if="day" class="day-status">
              <span v-if="isUnavailable(day)" class="status-indicator unavailable">
                Unavailable
              </span>
              <span v-else-if="isSelected(day)" class="status-indicator selected">
                Selected
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend explaining the colors/statuses used in the calendar -->
      <div class="calendar-legend">
        <div class="legend-item">
          <span class="legend-color available"></span>
          <span>Available</span>
        </div>
        <div class="legend-item">
          <span class="legend-color unavailable"></span>
          <span>Unavailable</span>
        </div>
        <div class="legend-item">
          <span class="legend-color selected"></span>
          <span>Selected</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'Calendar',
  props: {
    // Array of dates that are not available for booking
    unavailableDates: {
      type: Array,
      required: true,
    },
    // Selected start date for the booking range
    selectedStartDate: {
      type: Date,
      default: null,
    },
    // Selected end date for the booking range
    selectedEndDate: {
      type: Date,
      default: null,
    },
    // Minimum allowed date (availability start)
    minDate: {
      type: Date,
      required: true,
    },
    // Maximum allowed date (availability end)
    maxDate: {
      type: Date,
      required: true,
    }
  },

  setup(props, { emit }) {
    const currentDate = ref(new Date());

    // Basic calendar configuration
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Computed properties for current month and year in UTC
    const currentMonth = computed(() => currentDate.value.getUTCMonth());
    const currentYear = computed(() => currentDate.value.getUTCFullYear());

    // Check if previous month navigation should be disabled
    const isPreviousMonthDisabled = computed(() => {
      const today = new Date();
      return currentDate.value < props.minDate ||
             (currentYear.value === today.getUTCFullYear() &&
              currentMonth.value <= today.getUTCMonth());
    });

    // Generate calendar days for the current month in UTC
    const calendarDays = computed(() => {
      const days = [];
      const firstDay = new Date(Date.UTC(currentYear.value, currentMonth.value, 1));
      const lastDay = new Date(Date.UTC(currentYear.value, currentMonth.value + 1, 0));

      // Add empty slots for days before the first day of the month
      for (let i = 0; i < firstDay.getUTCDay(); i++) {
        days.push(null);
      }

      // Add all days of the current month
      for (let i = 1; i <= lastDay.getUTCDate(); i++) {
        days.push(new Date(Date.UTC(currentYear.value, currentMonth.value, i)));
      }

      return days;
    });

    // Check if a date is unavailable
    const isUnavailable = (date) => {
      if (!date) return false;

      // Check if date is within allowed range
      if (date < props.minDate || date > props.maxDate) {
        return true;
      }

      // Check if date is in unavailable dates list
      return props.unavailableDates.some(unavailableDate => {
        const unavailable = new Date(unavailableDate);
        return unavailable.getUTCDate() === date.getUTCDate() &&
               unavailable.getUTCMonth() === date.getUTCMonth() &&
               unavailable.getUTCFullYear() === date.getUTCFullYear();
      });
    };

    // Check if a date is within the selected range
    const isSelected = (date) => {
      if (!date || !props.selectedStartDate) return false;

      if (props.selectedStartDate && props.selectedEndDate) {
        return date >= props.selectedStartDate && date <= props.selectedEndDate;
      }

      return date.getUTCDate() === props.selectedStartDate.getUTCDate() &&
             date.getUTCMonth() === props.selectedStartDate.getUTCMonth() &&
             date.getUTCFullYear() === props.selectedStartDate.getUTCFullYear();
    };

    // Check if any date in a range is unavailable
    const isRangeAvailable = (start, end) => {
      const current = new Date(start);
      while (current <= end) {
        if (isUnavailable(current)) {
          return false;
        }
        current.setUTCDate(current.getUTCDate() + 1);
      }
      return true;
    };

    // Handle date selection
    const handleDayClick = (date) => {
      if (!date || isUnavailable(date)) return;

      if (!props.selectedStartDate || (props.selectedEndDate && date < props.selectedStartDate)) {
        // Start new selection
        emit('update:selectedStartDate', new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())));
        emit('update:selectedEndDate', null);
      } else {
        // Complete the range if valid
        if (isRangeAvailable(props.selectedStartDate, date)) {
          emit('update:selectedEndDate', new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())));
        } else {
          // If range contains unavailable dates, start new selection
          emit('update:selectedStartDate', new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())));
          emit('update:selectedEndDate', null);
        }
      }
    };

    // Get CSS classes for a day cell
    const getDayClasses = (day) => {
      if (!day) return 'calendar-day empty';

      return {
        'calendar-day': true,
        'unavailable': isUnavailable(day),
        'selected': isSelected(day),
        'today': isToday(day),
      };
    };

    // Check if a date is today (in UTC)
    const isToday = (date) => {
      const today = new Date();
      return date.getUTCDate() === today.getUTCDate() &&
             date.getUTCMonth() === today.getUTCMonth() &&
             date.getUTCFullYear() === today.getUTCFullYear();
    };

    // Navigation methods
    const previousMonth = () => {
      if (!isPreviousMonthDisabled.value) {
        currentDate.value = new Date(Date.UTC(currentYear.value, currentMonth.value - 1, 1));
      }
    };

    const nextMonth = () => {
      if (currentDate.value < props.maxDate) {
        currentDate.value = new Date(Date.UTC(currentYear.value, currentMonth.value + 1, 1));
      }
    };

    return {
      currentMonth,
      currentYear,
      weekDays,
      monthNames,
      calendarDays,
      isPreviousMonthDisabled,
      handleDayClick,
      getDayClasses,
      previousMonth,
      nextMonth,
      isSelected,
      isUnavailable
    };
  },
};
</script>



<style scoped>
/* Wrapper for the entire calendar component */
.calendar-wrapper {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Container holding the calendar content */
.calendar-container {
  max-width: 100%;
}

/* Header containing navigation buttons and title */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* Title for the current month and year */
.calendar-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #1f2937; /* Darker text */
}

/* Navigation buttons */
.calendar-nav-btn {
  background: none;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.calendar-nav-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
}

.calendar-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Arrow styles for navigation */
.calendar-nav-arrow {
  font-size: 1.2rem;
  color: #1f2937; /* Darker text */
}

/* Weekdays header (e.g., Sun, Mon) */
.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 10px;
}

.weekday {
  text-align: center;
  font-weight: 600;
  color: #374151; /* Darker text for weekdays */
}

/* Calendar days grid */
.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.calendar-day {
  aspect-ratio: 1;
  padding: 8px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.calendar-day:hover:not(.unavailable):not(.empty) {
  background-color: #f3f4f6;
}

.calendar-day.empty {
  background-color: #f9fafb;
  cursor: default;
}

.calendar-day.unavailable {
  background-color: #fee2e2;
  cursor: not-allowed;
}

.calendar-day.selected {
  background-color: #dbeafe;
  border-color: #3b82f6;
}

.calendar-day.today {
  font-weight: bold;
  border-color: #3b82f6;
}

/* Day number */
.day-number {
  display: block;
  text-align: center;
  font-size: 0.9rem;
  color: #1f2937; /* Darker text for day numbers */
}

/* Day status indicators */
.day-status {
  position: absolute;
  bottom: 4px;
  left: 0;
  right: 0;
  text-align: center;
}

.status-indicator {
  font-size: 0.6rem;
  padding: 2px 4px;
  border-radius: 4px;
}

.status-indicator.unavailable {
  background-color: #ef4444;
  color: white;
}

.status-indicator.selected {
  background-color: #3b82f6;
  color: white;
}

/* Calendar legend */
.calendar-legend {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
  color: black;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.available {
  background-color: #fff;
  border: 1px solid #e5e7eb;
}

.legend-color.unavailable {
  background-color: #fee2e2;
}

.legend-color.selected {
  background-color: #dbeafe;
  border: 1px solid #3b82f6;
}

</style>
