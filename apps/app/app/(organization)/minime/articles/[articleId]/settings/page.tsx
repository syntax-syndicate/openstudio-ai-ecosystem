import { getArticleById } from '@/actions/articles';
import AppHeader from '@/app/(organization)/minime/components/layout/app-header';
import AppShell from '@/app/(organization)/minime/components/layout/app-shell';
import NavButton from '@/app/(organization)/minime/components/layout/nav-button';
import DeleteForm from '@/components/forms/delete-form';
import ExportButton from '@/components/forms/export-button';
import Form from '@/components/forms/form';
import UploadImage from '@/components/forms/upload-image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ArticleSettingsProps {
  params: {
    articleId: string;
  };
}

export const metadata: Metadata = {
  title: 'Settings',
};

export default async function ArticleSettings({
  params,
}: ArticleSettingsProps) {
  const { articleId } = await params;
  const article = await getArticleById(articleId);
  if (!article) {
    return notFound();
  }
  const endpoint = `minime/articles/${article[0].id}`;
  return (
    <AppShell>
      <AppHeader className="justify-start font-medium text-lg">
        <NavButton
          href={`/${endpoint}`}
          icon="arrowLeft"
          className="mr-2"
          size="icon"
          aria-label="Back to Article"
        />
        Article settings
      </AppHeader>
      <div className="flex flex-col gap-2">
        <Form
          title="Article slug"
          description="This is the URL slug for this article."
          endpoint={endpoint}
          inputData={{
            name: 'slug',
            placeholder: 'my-article',
            defaultValue: article[0].slug,
          }}
        />
        <Form
          title="Publish time"
          endpoint={endpoint}
          inputData={{
            name: 'publishedAt',
            type: 'date',
            'aria-label': 'Article published time',
            defaultValue: article[0].publishedAt.toISOString().slice(0, 10),
          }}
        />
        <Form
          title="SEO title"
          description="This title will be used for SEO. It's best to keep it between 50-60 characters."
          helpText="Please use 60 characters at maximum."
          endpoint={endpoint}
          inputData={{
            name: 'seoTitle',
            placeholder: 'My new article',
            defaultValue: article[0].seoTitle || '',
            maxLength: 60,
          }}
          required={false}
        />
        <Form
          type="textarea"
          title="SEO description"
          description="This description will be used for SEO. It's best to keep it between 150-160 characters."
          helpText="Please use 160 characters at maximum."
          endpoint={endpoint}
          textareaData={{
            name: 'seoDescription',
            placeholder: 'Short description',
            defaultValue: article[0].seoDescription || '',
            maxLength: 160,
          }}
          required={false}
        />
        <UploadImage
          title="Open graph image"
          description="This image will be used for SEO. It's best to keep it 1200x630."
          helpText="Up to 4MB"
          endpoint={endpoint}
          defaultValue={article[0].ogImage}
          name="ogImage"
          folder="og-images"
        />
        <Form
          title="Canonical URL"
          description="Set the canonical URL here if your article was first published elsewhere."
          endpoint={endpoint}
          inputData={{
            name: 'canonicalURL',
            placeholder: 'https://example.com/post-title',
            defaultValue: article[0].canonicalURL || '',
          }}
          required={false}
        />
        <Form
          title="Export"
          endpoint={`articles/${article[0].id}/export`}
          asChild
        >
          <ExportButton
            text="Export article"
            icon="download"
            endpoint={`articles/${article[0].id}/export`}
          />
        </Form>
        <DeleteForm
          title="Delete article"
          description="Enter your article slug"
          keyword={article[0].slug}
          endpoint={`/${endpoint}`}
          redirectPath="/articles"
        />
      </div>
    </AppShell>
  );
}
