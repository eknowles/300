module.exports = (plop) => {
  // controller generator
  plop.setGenerator('component', {
    description: 'app component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'component name please',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'app/components/{{kebabCase name}}/index.ts',
        templateFile: '.scripts/plop-templates/component/index.hbs',
      },
      {
        type: 'add',
        path:
          'app/components/{{kebabCase name}}/{{kebabCase name}}.component.tsx/',
        templateFile: '.scripts/plop-templates/component/component.hbs',
      },
    ],
  });
};
