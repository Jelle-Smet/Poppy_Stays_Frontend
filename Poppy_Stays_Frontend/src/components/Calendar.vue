<template>
  <div class="calendar-wrapper">
    <div class="calendar-container">
      <div class="calendar-header">
        <button class="calendar-nav-btn" @click="previousMonth" :disabled="isPreviousMonthDisabled">
          <span class="calendar-nav-arrow">←</span>
        </button>
        <h3 class="calendar-title">{{ monthNames[currentMonth] }} {{ currentYear }}</h3>
        <button class="calendar-nav-btn" @click="nextMonth">
          <span class="calendar-nav-arrow">→</span>
        </button>
      </div>

      <div class="calendar-body">
        <div class="calendar-weekdays">
          <span v-for="day in weekDays" :key="day" class="weekday">{{ day }}</span>
        </div>

        <div class="calendar-days">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            :class="getDayClasses(day)"
            @click="handleDayClick(day)"
          >
            <span v-if="day" class="day-number">{{ day.getDate() }}</span>
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
export default {
  name: 'Calendar',
  props: {
    unavailableDates: {
      type: Array,
      required: true
    },
    selectedStartDate: {
      type: Date,
      default: null
    },
    selectedEndDate: {
      type: Date,
      default: null
    }
  },

  data() {
    return {
      currentDate: new Date(),
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ]
    };
  },

  computed: {
    currentMonth() {
      return this.currentDate.getMonth();
    },

    currentYear() {
      return this.currentDate.getFullYear();
    },

    isPreviousMonthDisabled() {
      const today = new Date();
      return (
        this.currentYear < today.getFullYear() ||
        (this.currentYear === today.getFullYear() && this.currentMonth <= today.getMonth())
      );
    },

    calendarDays() {
      const days = [];
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      
      // Add empty slots for days before the first day of the month
      for (let i = 0; i < firstDay.getDay(); i++) {
        days.push(null);
      }

      // Add all days of the month
      for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(this.currentYear, this.currentMonth, i));
      }

      return days;
    }
  },

  methods: {
    previousMonth() {
      if (!this.isPreviousMonthDisabled) {
        this.currentDate = new Date(this.currentYear, this.currentMonth - 1, 1);
      }
    },

    nextMonth() {
      this.currentDate = new Date(this.currentYear, this.currentMonth + 1, 1);
    },

    isUnavailable(date) {
      if (!date) return false;
      const dateString = date.toISOString().split('T')[0];
      return this.unavailableDates.includes(dateString);
    },

    isSelected(date) {
      if (!date) return false;
      if (this.selectedStartDate && this.selectedEndDate) {
        return date >= this.selectedStartDate && date <= this.selectedEndDate;
      }
      return false;
    },

    handleDayClick(date) {
      if (!date || this.isUnavailable(date)) return;
      this.$emit('date-selected', date);
    },

    getDayClasses(day) {
      if (!day) return 'calendar-day empty';
      
      return {
        'calendar-day': true,
        'unavailable': this.isUnavailable(day),
        'selected': this.isSelected(day),
        'today': this.isToday(day)
      };
    },

    isToday(date) {
      const today = new Date();
      return date.toDateString() === today.toDateString();
    }
  }
};
</script>

<style scoped>
.calendar-wrapper {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.calendar-container {
  max-width: 100%;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

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

.calendar-nav-arrow {
  font-size: 1.2rem;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 10px;
}

.weekday {
  text-align: center;
  font-weight: 600;
  color: #6b7280;
}

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

.day-number {
  display: block;
  text-align: center;
  font-size: 0.9rem;
}

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

.calendar-legend {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
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