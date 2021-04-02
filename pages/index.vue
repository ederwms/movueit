<template>
  <section class="flex flex-col lg:flex-row flex-1 lg:flex-none lg:mt-16 sm:gap-x-10 md:gap-x-20">
    <div class="flex flex-col w-full lg:w-1/2">
      <profile />

      <completed-challenges />

      <countdown @completed="getNewChallenge" />

      <button
        v-if="hasCountdownCompleted"
        disabled
        class="button completed"
      >
        Ciclo completo
      </button>

      <button
        v-else-if="isCountdownActive"
        class="button abandon"
        @click="setCountdownState(false)"
      >
        Abandonar ciclo
      </button>

      <button
        v-else
        class="button start"
        @click="setCountdownState(true)"
      >
        Iniciar um ciclo
      </button>
    </div>

    <card
      id="challenge"
      class="w-full lg:w-1/2"
    />
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { Mutations as ChallengesMT } from '~/store/Challenges/types'
import { Mutations as CountdownMT } from '~/store/Countdown/types'

import { playAudio, sendNotification, getRandomNumber, scrollToElement } from '~/utils'

import Card from '~/components/organisms/Card.vue'
import Countdown from '~/components/molecules/Countdown.vue'
import CompletedChallenges from '~/components/atoms/CompletedChallenges.vue'
import Profile from '~/components/molecules/Profile.vue'

interface Head {
  title: string
}

export default Vue.extend({
  layout: 'Default',
  head (): Head {
    return {
      title: 'Home | movue.it'
    }
  },
  components: {
    Card,
    Profile,
    Countdown,
    CompletedChallenges
  },
  mounted () {
    if ('Notification' in window) {
      Notification.requestPermission()
    }
  },
  computed: {
    ...mapState('Countdown', {
      hasCountdownCompleted: 'hasCompleted',
      isCountdownActive: 'isActive'
    }),
    ...mapGetters('Challenges', ['challengesLength'])
  },
  methods: {
    ...mapMutations({
      setCountdownHasCompleted: `Countdown/${CountdownMT.SET_HAS_COMPLETED}`,
      setCountdownIsActive: `Countdown/${CountdownMT.SET_IS_ACTIVE}`,
      setCurrentChallengeIndex: `Challenges/${ChallengesMT.SET_CURRENT_CHALLENGE_INDEX}`
    }),
    setCountdownState (flag: boolean): void {
      this.setCountdownHasCompleted(false)
      this.setCountdownIsActive(flag)
    },
    getNewChallenge (): void {
      const index = getRandomNumber(0, this.challengesLength)

      this.setCountdownHasCompleted(true)
      this.setCurrentChallengeIndex(index)

      if (Notification?.permission === 'granted') {
        playAudio('/notification.mp3')

        sendNotification('Novo desafio', {
          body: 'Um novo desafio começou! Vá completar!',
          icon: '/favicon.png'
        })
      }

      this.$nextTick(() => {
        scrollToElement('#challenge')
      })
    }
  }
})
</script>
