import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import "@testing-library/jest-dom";

import { Main } from "../pages/Main";

const queryClient = new QueryClient();

test("renders learn react link", () => {
  render(
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>,
  );
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
