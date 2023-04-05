import * as React from 'react';
import {
  json,
  type DataFunctionArgs,
  type V2_MetaFunction,
  type HeadersFunction
} from '@remix-run/node';
import { Resend } from 'resend';
import { Form, useActionData } from '@remix-run/react';
import { Dialog, Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  EnvelopeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { z } from 'zod';

export const headers: HeadersFunction = () => ({
  'Cache-Control': 'max-age=604800, public'
});

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Gasta2' },
    {
      content: 'An application to manage expenses with your partner.'
    }
  ];
};

export async function action({ request }: DataFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');
  const safeEmail = z.string().email();
  const resend = new Resend(process.env.RESEND_API_KEY!);
  try {
    await resend.sendEmail({
      from: 'diego@d1ego.com',
      to: safeEmail.parse(email),
      subject: 'Thanks for joining the mailing list!',
      html: `
      <h1>Thanks for joining the mailing list!</h1>
      <p>We are launching soon and you will have free and early access to our app.</p>
    `
    });
    return json({ msg: 'ok' });
  } catch (error) {
    console.log(error);
    return json({ msg: 'error' });
  }
}

export default function Index() {
  const [open, setOpen] = React.useState(false);

  const actionData = useActionData<typeof action>();

  const content = {
    title: !actionData ? 'Join the waitlist' : 'Thank you!',
    body: !actionData
      ? `Once we launch, we'll send you an email with a link to the app.`
      : 'Be on the lookout for an email from us.'
  };

  return (
    <main className='h-full bg-black text-white'>
      <section className='mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8'>
        <p className='font-thin leading-loose text-gray-300'>Gasta2</p>
        <h1 className='text-6xl font-extrabold tracking-tighter lg:text-8xl'>
          Coming soon.
        </h1>
        <button
          type='button'
          onClick={() => setOpen(true)}
          className='mt-10 rounded-md bg-indigo-700 px-3.5 py-2.5 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        >
          Join the waitlist
        </button>

        <Transition.Root show={open} as={React.Fragment}>
          <Dialog as='div' className='relative z-10' onClose={setOpen}>
            <Transition.Child
              as={React.Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
            </Transition.Child>

            <div className='fixed inset-0 z-10 overflow-y-auto'>
              <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
                <Transition.Child
                  as={React.Fragment}
                  enter='ease-out duration-300'
                  enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                  enterTo='opacity-100 translate-y-0 sm:scale-100'
                  leave='ease-in duration-200'
                  leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                  leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                >
                  <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-black px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6'>
                    <div>
                      <div className='flex items-center justify-center'>
                        {!actionData ? (
                          <EnvelopeIcon className='h-10 w-10 text-white' />
                        ) : actionData.msg === 'ok' ? (
                          <CheckCircleIcon className='h-10 w-10 text-white' />
                        ) : (
                          <XMarkIcon className='h-10 w-10 text-white' />
                        )}
                      </div>
                      <div className='mt-3 text-center sm:mt-5'>
                        <Dialog.Title
                          as='h3'
                          className='text-base font-semibold leading-6 text-white'
                        >
                          {content.title}
                        </Dialog.Title>
                        <div className='mt-2 px-10'>
                          <p className='text-sm text-gray-500'>
                            {content.body}
                          </p>
                        </div>
                      </div>
                      {!actionData ? (
                        <Form className='mt-5 sm:mt-6' method='POST'>
                          <div className='mb-4 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
                            <label
                              htmlFor='email'
                              className='block text-xs font-medium text-white sm:text-sm'
                            >
                              Email address
                            </label>
                            <input
                              type='email'
                              name='email'
                              id='email'
                              className='block w-full border-0 bg-transparent p-0 text-gray-500 focus:ring-0 sm:leading-6'
                              placeholder='Enter your email address'
                              required
                            />
                          </div>
                          <button
                            type='submit'
                            className='inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                          >
                            Submit
                          </button>
                        </Form>
                      ) : (
                        <>
                          <div>something</div>
                        </>
                      )}
                      <div className='absolute right-0 top-0 pr-4 pt-4 sm:block'>
                        <button
                          type='button'
                          className='rounded-md bg-transparent text-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                          onClick={() => setOpen(false)}
                        >
                          <span className='sr-only'>Close</span>
                          <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </section>
    </main>
  );
}
