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
width: 100%;
height: auto;
max-height: 90px;
}

.footer-image {
  width: 100%;
height: auto;
max-height: 56px;
}
</style>
