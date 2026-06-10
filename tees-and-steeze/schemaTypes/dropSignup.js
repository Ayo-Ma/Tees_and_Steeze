export default {
  name: 'dropSignup',
  title: 'Drop Signups',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'contact',
      title: 'WhatsApp / Email',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'source',
      title: 'Signed up from',
      type: 'string',
      description: 'Which page they signed up from',
    },
    {
      name: 'signedUpAt',
      title: 'Date',
      type: 'datetime',
    },
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'dateDesc',
      by: [{ field: 'signedUpAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'contact', subtitle: 'signedUpAt' },
  },
}