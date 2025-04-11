<template>
  <div>
    <el-dialog
        title="Multi-Instance Configuration"
        :visible.sync="dialogVisible"
        width="500px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        class="muti-instance"
        @closed="$emit('close')"
    >
      <el-alert
          type="info"
          :closable="false"
          show-icon
          style="margin-bottom: 20px"
      >
        <template #title>
          According to the BPMN 2.0 specification, a parent execution is created for each instance, with the following variables provided:<br>
          <strong>nrOfInstances</strong>: Total number of instances.<br>
          <strong>nrOfActiveInstances</strong>: Number of currently active (i.e. not completed) instances. This value is always 1 for sequential multi-instance.<br>
          <strong>nrOfCompletedInstances</strong>: Number of completed instances.<br>
          <strong>loopCounter</strong>: The index of the current instance in the for-each loop.<br>
        </template>
      </el-alert>
      <x-form ref="xForm" v-model="formData" :config="formConfig" />
    </el-dialog>
  </div>
</template>

<script>
import mixinPanel from '../../../common/mixinPanel'
import { formatJsonKeyValue } from '../../../common/parseElement'
export default {
  mixins: [mixinPanel],
  data() {
    return {
      dialogVisible: true,
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
            name: 'collection',
            label: 'Collection',
            tooltip: 'This property will be parsed as an expression. If the expression evaluates to a string instead of a collection—either because it was set as a static string or the expression result is a string—that string will be used as the variable name to retrieve the actual collection from process variables.'
          },
          {
            xType: 'input',
            name: 'elementVariable',
            label: 'Element Variable',
            tooltip: 'Before creating each user task, a local process variable is created with this string as the label and the current collection item as the value. This variable is used to assign the user task. Typically, it should match the assignee variable.'
          },
          {
            xType: 'radio',
            name: 'isSequential',
            label: 'Execution Mode',
            dic: [
              { label: 'Sequential', value: true },
              { label: 'Parallel', value: false }
            ]
          },
          {
            xType: 'input',
            name: 'completionCondition',
            label: 'Completion Condition',
            tooltip: `By default, a multi-instance activity finishes when all instances are completed. However, you can provide an expression that is evaluated each time an instance completes. When the expression evaluates to true, all remaining instances are destroyed, the multi-instance activity is completed, and the process continues. Example: \${nrOfCompletedInstances/nrOfInstances >= 0.6} — completes when 60% of tasks are done.`
          }
        ],
        operate: [
          { text: 'Confirm', show: true, click: _this.save },
          { text: 'Clear', show: true, click: () => { _this.formData = {} } }
        ]
      }
    }
  },
  mounted() {
    const cache = JSON.parse(JSON.stringify(this.element.businessObject.loopCharacteristics ?? {}))
    cache.completionCondition = cache.completionCondition?.body
    this.formData = formatJsonKeyValue(cache)
  },
  methods: {
    updateElement() {
      if (this.formData.isSequential !== null && this.formData.isSequential !== undefined) {
        let loopCharacteristics = this.element.businessObject.get('loopCharacteristics')
        if (!loopCharacteristics) {
          loopCharacteristics = this.modeler.get('moddle').create('bpmn:MultiInstanceLoopCharacteristics')
        }
        loopCharacteristics['isSequential'] = this.formData.isSequential
        loopCharacteristics['collection'] = this.formData.collection
        loopCharacteristics['elementVariable'] = this.formData.elementVariable
        if (this.formData.completionCondition) {
          const completionCondition = this.modeler.get('moddle').create('bpmn:Expression', { body: this.formData.completionCondition })
          loopCharacteristics['completionCondition'] = completionCondition
        }
        this.updateProperties({ loopCharacteristics: loopCharacteristics })
      } else {
        delete this.element.businessObject.loopCharacteristics
      }
    },
    save() {
      this.updateElement()
      this.dialogVisible = false
    }
  }
}
</script>

<style>
.muti-instance .el-form-item {
  margin-bottom: 22px;
}
</style>
