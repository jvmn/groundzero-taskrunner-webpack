// const ROOT = '<%= classname %>'
module.exports = {
  title: '<%= filename %>',
  label: '<%= filename %>',
  status: 'wip',
  <% if(engine === 'hbs'){ %>context: {
    jsInstanceId: false, // autoloader js instance id 
    tag: 'section',
    id: '',
    modifiers: '',
    xclasses: '',
    xattributes: '',
  },<% } %><% if(engine === 'twig'){ %>context: {
    tag: 'section',
    modifiers: [],
    states: [],
    xclasses: [],
    id: '',
  },<% } %>
  variants: []
}
