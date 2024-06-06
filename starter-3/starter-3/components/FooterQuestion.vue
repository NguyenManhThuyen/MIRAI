<template>
  <footer class="site-footer">
    <img :src="footerImage" alt="Footer" class="footer-image" />
  </footer>
</template>

<script>
export default {
name: 'FooterComponent',
props: {
  footerImage: {
    type: String,
    required: true
  }
}
};
</script>

<style scoped>
.site-footer {
background-color: #f8f9fa;
text-align: center;
}

.footer-image {
  width: auto;
height: auto;
margin-left: auto; /* Căn lề phải */
margin-right: auto; /* Căn lề trái */
}
</style>
