import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TechnicalOverview() {
  return (
    <Card className="mt-12">
      <CardHeader>
        <CardTitle>Working of Search App</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          The search functionality is implemented using a server action, which searches an array of pre-populated user data. The AsyncSelect component sends the search query to the server action, which filters the users based on a{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            startsWith
          </code>
          {" "}matching logic. When a user is selected from the dropdown, their details are displayed in a card component.
        </p>
      </CardContent>
    </Card>
  )
}

