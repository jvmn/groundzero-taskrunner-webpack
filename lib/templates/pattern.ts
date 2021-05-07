/**
 * init <%= filename %>
 * @alias <%= filename %>
 * @namespace <%= namespace %>
 * @return {Object} <% if(js){ %>public methods and css bundle<% } %><% if (!js) { %>with css bundle<% } %>
 */
<% if (js) { %>
import { FrontendModuleInstance } from "../../../../types"
<% } %>
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
const <%= filename %> = (context: HTMLElement): FrontendModuleInstance => {
  // private functions

  // public functions
  const mod: FrontendModuleInstance = {
    init: function () {
      if (context === undefined) return

      context.classList.add('AP_st-init')
      console.log('init <%= filename %>')
    }
  }
  return mod
}
export default <%= filename %>
<% } %>