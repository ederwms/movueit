<template>
  <div class="flex justify-center items-center mt-8 lg:mt-14 text-9xl text-title font-rajdhani">
    <countdown-digits :digits="minutes" />

    <span class="bg-background px-2">:</span>

    <countdown-digits :digits="seconds" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { Mutations } from '~/store/Countdown/types'

import CountdownDigits from '~/components/atoms/CountdownDigits.vue'

let TIMEOUT_REFERENCE: ReturnType<typeof setTimeout>

export default Vue.extend({
  components: {
    CountdownDigits
  },
  computed: {
    ...mapState('Countdown', ['time', 'isActive']),
    ...mapGetters('Countdown', ['minutes', 'seconds'])
  },
  methods: {
    ...mapMutations('Countdown', {
      SET_TIME: Mutations.SET_TIME,
      RESET_TIME: Mutations.RESET_TIME
    }),
    runCountdown (flag: boolean): void {
      if (this.isActive && flag) {
        TIMEOUT_REFERENCE = setTimeout(() => {
          this.SET_TIME(this.time - 1)
        }, 1000)
      } else {
        clearTimeout(TIMEOUT_REFERENCE)
      }
    }
  },
  watch: {
    isActive (newValue: boolean) {
      this.runCountdown(newValue)

      if (!newValue) {
        this.RESET_TIME()
      }
    },
    time (newValue: number) {
      if (newValue > 0) {
        this.runCountdown(true)
      } else {
        this.$emit('completed')
      }
    }
  }
})
</script>
