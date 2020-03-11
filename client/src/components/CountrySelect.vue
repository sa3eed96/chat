<template>
<div>
    <label for="guestCountry" >Country</label>
    <select v-model="selected" class="form-control" id="guestCountry">
        <option disabled value="">select country</option>
        <option v-for="country in countries" v-bind:key="country">
            {{ country }}
        </option>
    </select>
</div>
</template>

<script>
import countryList from 'country-list';

export default {
  props: ['default'],
  data() {
    return {
      selected: '',
      countries: [],
    };
  },
  created() {
    this.countries = countryList.getNames();
    if (this.default) { this.selected = this.default; }
  },
  watch: {
    selected(val) {
      this.$emit('countrySelected', val);
    },
  },
};
</script>
