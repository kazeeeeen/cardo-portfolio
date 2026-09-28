import { Heading } from '../components/Heading'
import { Image } from '../components/Image'
import { Page } from '../components/Page'
import { asset, content } from '../data'
import { box, fs } from '../lib/layout'

// The last page: the portrait full-bleed and untouched (the global grain sits
// on top), "let's work" bottom-left, and the contact list right. No footer,
// as in the original.
export function Contact() {
  const { contact } = content
  return (
    <Page id="contact" label="contact" tone="ink" cover>
      {/* The original is zoomed in slightly and cropped to the lower body. */}
      <Image
        asset={asset('portraits', 'contact-portrait')}
        fill
        position="50% 74%"
        className="scale-[1.03] origin-[50%_85%]"
        sizes="100vw"
      />

      <div style={box(84, 362)}>
        <Heading size={199} tone="paper" split style={{ lineHeight: 0.66 }}>
          l<em>e</em>t’s
          <br />
          <em>work</em>
        </Heading>
      </div>

      <div style={box(970, 418)} data-reveal>
        <Heading size={68} tone="paper">
          {contact.label}
        </Heading>
        <ul className="condensed leading-[0.9] tracking-[-0.02em] stack:leading-[2]" style={{ marginTop: fs(66), fontSize: `max(0.875rem, ${fs(20.7)})` }}>
          {contact.items.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="contact-link group text-gray-200"
                {...(item.href.startsWith('http') && { target: '_blank', rel: 'noreferrer' })}
              >
                <b className="font-bold text-white transition-colors group-hover:text-accent group-focus-visible:text-accent">
                  {item.label}
                </b>{' '}
                {item.value}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Page>
  )
}
