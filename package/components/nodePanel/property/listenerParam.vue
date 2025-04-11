<template>
  <div>
    <el-dialog
        title="Listener Parameters"
        :visible.sync="dialogVisible"
        width="700px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        @closed="$emit('close', formData.paramList)"
    >
      <x-form ref="xForm" v-model="formData" :config="formConfig" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="closeDialog">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixinXcrud from '../../../common/mixinXcrud'
export default {
  mixins: [mixinXcrud],
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: true,
      formData: {
        paramList: this.value
      }
    }
  },
  computed: {
    formConfig() {
      return {
        inline: false,
        item: [
          {
            xType: 'tabs',
            tabs: [
              {
                label: 'Listener Parameters',
                name: 'paramList',
                column: [
                  {
                    label: 'Type',
                    name: 'type',
                    width: 180,
                    rules: [{ required: true, message: 'Please select', trigger: ['blur', 'change'] }],
                    xType: 'select',
                    dic: [
                      { label: 'String', value: 'stringValue' },
                      { label: 'Expression', value: 'expression' }
                    ]
                  },
                  {
                    label: 'Name',
                    name: 'name',
                    width: 180,
                    rules: [{ required: true, message: 'Please select', trigger: ['blur', 'change'] }],
                    xType: 'input'
                  },
                  {
                    label: 'Value',
                    name: 'value',
                    xType: 'input',
                    rules: [{ required: true, message: 'Please enter', trigger: ['blur', 'change'] }]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    closeDialog() {
      this.$refs.xForm.validate().then(() => {
        this.dialogVisible = false
      }).catch(e => console.error(e))
    }
  }
}
</script>

<style>
.flow-containers .el-badge__content.is-fixed {
  top: 18px;
}
</style>
