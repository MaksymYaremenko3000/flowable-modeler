<template>
  <div>
    <x-form ref="xForm" v-model="formData" :config="formConfig">
      <template #executionListener>
        <el-badge :value="executionListenerLength">
          <el-button size="small" @click="dialogName = 'executionListenerDialog'">Edit</el-button>
        </el-badge>
      </template>
      <template #signal>
        <el-badge :value="signalLength">
          <el-button size="small" @click="dialogName = 'signalDialog'">Edit</el-button>
        </el-badge>
      </template>
    </x-form>
    <executionListenerDialog
        v-if="dialogName === 'executionListenerDialog'"
        :element="element"
        :modeler="modeler"
        @close="finishExecutionListener"
    />
    <signalDialog
        v-if="dialogName === 'signalDialog'"
        :element="element"
        :modeler="modeler"
        @close="finishExecutionListener"
    />
  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import mixinExecutionListener from '../../common/mixinExecutionListener'
import signalDialog from './property/signal'
import { commonParse } from '../../common/parseElement'

export default {
  components: {
    signalDialog
  },
  mixins: [mixinPanel, mixinExecutionListener],
  data() {
    return {
      signalLength: 0,
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
            xType: 'select',
            name: 'processCategory',
            label: 'Process Category',
            dic: { data: _this.categorys, label: 'name', value: 'id' }
          },
          {
            xType: 'input',
            name: 'id',
            label: 'Process Key',
            rules: [{ required: true, message: 'ID cannot be empty' }]
          },
          {
            xType: 'input',
            name: 'name',
            label: 'Process Name'
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
            xType: 'slot',
            name: 'signal',
            label: 'Signal Definition'
          }
        ]
      }
    }
  },
  watch: {
    'formData.processCategory': function (val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:processCategory': val })
    }
  },
  created() {
    this.formData = commonParse(this.element)
  },
  methods: {
    computedSignalLength() {
      this.signalLength = this.element.businessObject.extensionElements?.values?.length ?? 0
    },
    finishSignal() {
      if (this.dialogName === 'signalDialog') {
        this.computedSignalLength()
      }
      this.dialogName = ''
    }
  }
}
</script>

<style>
</style>
