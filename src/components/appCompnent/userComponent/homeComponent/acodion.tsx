import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AccordionSection() {
  return (
    <div className="px-10  py-10 mt-10">
      <h1 className="text-4xl font-bold font-stretch-90% text-center mb-6">
        Frequently Asked Questions
      </h1>

      <Accordion
        type="single"
        collapsible
        className="w-full lg:px-16 "
        defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h1 className=" font-bold text-[18px]">
              What is Sellora used for?
            </h1>
          </AccordionTrigger>
          <AccordionContent className=" text-balance text-[18px] font-medium text-muted-foreground">
            {" "}
            <p>
              Sellora is an online marketplace where users can license stock
              photos, vector graphics, and stock footage from artists. Basic
              features are free but include ads and limitations. Pro subscribers
              get advanced licensing and a more comprehensive selection of
              content.
            </p>
          </AccordionContent>
        </AccordionItem>
        {/* Accodion 2 */}
        <AccordionItem value="item-2">
          <AccordionTrigger className="">
            <h1 className=" font-bold text-[18px]">Is Sellora really free?</h1>
          </AccordionTrigger>
          <AccordionContent className=" text-balance text-[18px] font-medium text-muted-foreground">
            <p>
              Sellora users are able to download some resources for free, and
              other resources require a Pro subscription. Resources that can be
              downloaded for free are available under the Vecteezy Free license,
              which requires the user to provide attribution.
            </p>
          </AccordionContent>
        </AccordionItem>
        {/* Accodion 3 */}
        <AccordionItem value="item-3">
          <AccordionTrigger className="">
            <h1 className=" font-bold text-[18px]">
              What does royalty free mean?
            </h1>
          </AccordionTrigger>
          <AccordionContent className=" text-balance text-[18px] font-medium text-muted-foreground">
            <p>
              Royalty free content can be licensed without hiring the creator,
              purchasing the copyright, or paying royalties for each use. All of
              the content on Vecteezy is royalty free, meaning it can be used
              multiple times once a license is acquired without paying a fee for
              each use.
            </p>
          </AccordionContent>
        </AccordionItem>
        {/* Accordion 4 */}
        <AccordionItem value="item-4">
          <AccordionTrigger className="">
            <h1 className=" font-bold text-[18px]">
              Can I use content from Sellora for commercial use?
            </h1>
          </AccordionTrigger>
          <AccordionContent className=" text-balance text-[18px] font-medium text-muted-foreground">
            <p>
              Both free and Pro content on Vecteezy are safe for commercial use,
              but restrictions can apply based on how you plan to use the
              content.
            </p>
          </AccordionContent>
        </AccordionItem>
        {/* Accodon 5 */}
        <AccordionItem value="item-5">
          <AccordionTrigger className="">
            <h1 className=" font-bold text-[18px]">
              How can I become a Sellora contributor?
            </h1>
          </AccordionTrigger>
          <AccordionContent className=" text-balance text-[18px] font-medium text-muted-foreground">
            <p>
              The Sellora Contributor Program is for designers, illustrators,
              photographers, and videographers who are interested in earning
              passive income while getting their work in front of millions of
              users worldwide. Simply click through to our contributor signup to
              get started. You’ll enter an email address and a password to
              create your account and then upload some samples of your work.
              Once your application is approved, you’ll be able to upload as
              much or as little content as you want and earn money with every
              download.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
