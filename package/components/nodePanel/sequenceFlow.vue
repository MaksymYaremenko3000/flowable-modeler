<template>
  <div>
    <x-form ref="xForm" v-model="formData" :config="formConfig">
      <template #executionListener>
        <el-badge :value="executionListenerLength">
          <el-button size="small" @click="dialogName = 'executionListenerDialog'">Edit</el-button>
        </el-badge>
      </template>
    </x-form>
    <executionListenerDialog
        v-if="dialogName === 'executionListenerDialog'"
        :element="element"
        :modeler="modeler"
        @close="finishExecutionListener"
    />
  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import mixinExecutionListener from '../../common/mixinExecutionListener'
import { commonParse, conditionExpressionParse } from '../../common/parseElement'

export default {
  mixins: [mixinPanel, mixinExecutionListener],
  data() {
    return {
      formData: {}
    }
  },
  computed: {
    formConfig() {
      return {
        inline: false,
        item: [
          {
            xType: 'input',
            name: 'id',
            label: 'Node ID',
            rules: [{ required: true, message: 'ID cannot be empty' }]
          },
          {
            xType: 'input',
            name: 'name',
            label: 'Node Name'
          },
          {
            xType: 'input',
            name: 'documentation',
            label: 'Node Description'
          },
          {
            xType: 'slot',
            name: 'executionListener',
            label: 'Execution Listener'
          },
          {
            xType: 'input',
            name: 'conditionExpression',
            label: 'Condition Expression'
          },
          {
            xType: 'input',
            name: 'skipExpression',
            label: 'Skip Expression'
          }
        ]
      }
    }
  },
  watch: {
    'formData.conditionExpression': function (val) {
      if (val) {
        const newCondition = this.modeler.get('moddle').create('bpmn:FormalExpression', { body: val })
        this.updateProperties({ conditionExpression: newCondition })
      } else {
        this.updateProperties({ conditionExpression: null })
      }
    },
    'formData.skipExpression': function (val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:skipExpression': val })
    }
  },
  created() {
    let cache = commonParse(this.element)
    cache = conditionExpressionParse(cache)
    this.formData = cache
  }
}
</script>

<style></style>
