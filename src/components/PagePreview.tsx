"use client";

import type { LandingPage } from "@/types";

interface PagePreviewProps {
  page: LandingPage;
}

export default function PagePreview({ page }: PagePreviewProps) {
  return (
    <div className="bg-white text-gray-900 rounded-2xl overflow-hidden">
      {/* Browser top bar */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-500 ml-2">
          {page.slug}
        </div>
      </div>

      {/* Page content */}
      <div className="p-6 sm:p-8 max-h-[calc(100vh-300px)] overflow-y-auto">
        {/* SEO Meta */}
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 space-y-1">
          <p><strong>Title:</strong> {page.title}</p>
          <p><strong>Description:</strong> {page.metaDescription}</p>
          <p><strong>Slug:</strong> /{page.slug}</p>
        </div>

        {/* H1 */}
        <h1 className="text-2xl font-bold mb-6 text-gray-900">{page.h1}</h1>

        {/* Content */}
        <div
          className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        {/* FAQ */}
        {page.faq && page.faq.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {page.faq.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 text-sm mb-2">
                    Q: {item.question}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 text-center border-t border-gray-200 pt-6">
          <a
            href={page.cta.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            {page.cta.text}
          </a>
        </div>
      </div>
    </div>
  );
}
