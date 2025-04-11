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
import { commonParse } from '../../common/parseElement'

export default {
  mixins: [mixinPanel, mixinExecutionListener],
  data() {
    return {
      formData: {}
    }
  },
  computed: {
    formConfig() {
      const _this = this
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
            name: 'initiator',
            label: 'Initiator',
            show: !!_this.showConfig.initiator
          },
          {
            xType: 'input',
            name: 'formKey',
            label: 'Form Key',
            show: !!_this.showConfig.formKey
          }
        ]
      }
    }
  },
  watch: {
    'formData.initiator': function (val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:initiator': val })
    },
    'formData.formKey': function (val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:formKey': val })
    }
  },
  created() {
    this.formData = commonParse(this.element)
  }
}
</script>

<style>
</style>
