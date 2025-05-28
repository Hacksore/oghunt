import { Hr, Link, Text } from "jsx-email";

const anchor = {
  color: "#525f7f",
  textDecoration: "underline",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "22px",
  textAlign: "center" as const,
};


const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

export const Footer = () => {
  return (
    <>
      <Hr style={hr} />
      <Text style={footer}>
        If you no longer wish to receive updates, you can{" "}
        <Link style={anchor} href="https://oghunt.com/unsubscribe?email={email}">
          unsubscribe here
        </Link>
        .
      </Text>
    </>
  );
};
