/**
 * init <%= filename %>
 * @alias <%= filename %>
 * @namespace <%= namespace %>
 * @return {Object} <% if(js){ %>public methods and css bundle<% } %><% if (!js) { %>with css bundle<% } %>
 */
<% if (scss) { %>
<% if (cssinjs) { %>
require('./<%= filename %>.module')
<% } else { %>
if (process.env.NODE_ENV === 'development') {
  require('./<%= filename %>.module')
}
<% } %>
<% } %>
<% if (js) { %>
const <%= filename %> = (context) => {
  // private functions

  // public functions
  const mod = {
    init: function () {
      if (context === undefined) {
        context = document.querySelector('[data-jsinit="<%= filename %>"]')
      }

      context.classList.add('AP_st-init')
      console.log('init <%= filename %>')
    }
  }
  return mod
}
export default <%= filename %>
<% } %>