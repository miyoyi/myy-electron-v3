<script lang="tsx">
  import { defineComponent } from "vue";

  export default defineComponent({
    props: {
      column: Object,
      row: Object,
      tsx: {
        type: Function,
        required: true
      }
    },
    setup(props) {
      return () => props.tsx(props.row, props.column);
    }
  });
</script>
