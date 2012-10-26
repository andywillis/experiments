<script id='results-template' type='text/template'>
  <ul>
    <% for (var i = 0; i < photos.length; i++) { %>
      <% var photo = photos[i]; %>
      <li>
        <em><%= photo.title %></em> by <%= photo.location %>
      </li>
    <% } %>
  </ul>
</script>