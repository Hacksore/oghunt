import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text
} from 'jsx-email';

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif'
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  marginBottom: '64px',
  padding: '20px 0 48px'
};

const box = {
  padding: '0 48px'
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0'
};

const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const
};

const anchor = {
  color: '#525f7f',
  textDecoration: 'underline'
};

const button = {
  backgroundColor: '#4F46E5',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '12px 24px',
  textDecoration: 'none',
  textAlign: 'center' as const
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '22px',
  textAlign: 'center' as const
};

export const Template = () => (
  <Html>
    <Head />
    <Preview>Welcome to OGHUNT - You're subscribed to our daily emails!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={paragraph}>
            Thanks for subscribing to OGHUNT's daily emails! We're excited to have you join our community and can't wait to share our daily updates with you.
          </Text>
          <Text style={paragraph}>
            You'll receive our latest updates and insights every day. In the meantime, you can check out our website to find more cool products.
          </Text>
          <Button
            align={'center'}
            style={button}
            href="https://oghunt.com"
            height={48}
            width={200}
          >
            Visit OGHUNT
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            If you no longer wish to receive updates, you can{' '}
            <Link style={anchor} href="https://oghunt.com/unsubscribe?email={email}">
              unsubscribe here
            </Link>
            .
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
