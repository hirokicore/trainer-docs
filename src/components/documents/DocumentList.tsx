import Link from 'next/link';
import { FileText, Download, Eye, PlusCircle } from 'lucide-react';
import { DOCUMENT_TYPE_LABELS, type Document } from '@/types';
import { formatDate } from '@/lib/utils';

interface DocumentListProps {
  documents: Document[];
  canCreate: boolean;
}

export default function DocumentList({ documents, canCreate }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText size={24} className="text-gray-400" />
        </div>
        <h3 className="text-gray-900 font-medium mb-1">書類がまだありません</h3>
        <p className="text-gray-500 text-sm mb-6">
          初めての書類を生成してみましょう
        </p>
        {canCreate && (
          <Link
            href="/documents/new"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <PlusCircle size={16} />
            書類を新規作成
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex-shrink-0 w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
            <FileText size={18} className="text-brand-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {doc.title}
            </p>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs text-gray-500">
                {DOCUMENT_TYPE_LABELS[doc.document_type]}
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-500">
                {formatDate(doc.created_at)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href={`/documents/${doc.id}`}
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-brand-600 px-2.5 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
            >
              <Eye size={14} />
              確認
            </Link>
            <Link
              href={`/documents/${doc.id}?download=true`}
              className="inline-flex items-center gap-1.5 text-xs text-white bg-brand-600 hover:bg-brand-700 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <Download size={14} />
              PDF
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
