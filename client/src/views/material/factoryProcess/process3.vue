<template>
    <div class="d-flex flex-row mb-3">
        <div class="p-2">
            <img src="http://yeonsus.com/academy/process3.gif" alt="포장공정" height="75" width="75"/>
        </div>
        <div class="p-2">
            <div style="height: 200px;">
                <table class="table align-items-center">
                    <tr>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                            상품명
                        </th>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                            수량
                        </th>
                    </tr>
                    <!-- <tr v-for="(cl, index) in material_input.slice(0, 10)" :key="index">
                        <td class="text-uppercase text-dark text-xxs font-weight-bolder opacity-7 ps-2">
                            {{ cl.material_name }}
                        </td>
                        <td class="text-uppercase text-dark text-xxs font-weight-bolder opacity-7 ps-2">
                            {{ cl.ord_qty }}
                        </td>
                    </tr> -->
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
    // import { defineProps } from 'vue';     //watch

    // const { material_input } = defineProps({
    //     material_input: Array,
    // });
</script>

<style lang="scss" scoped>
    table {
        border-spacing: 0;
        border-collapse: collapse;
    }

    table tr td {
        margin: 0;
        padding: 0;
    }
</style>