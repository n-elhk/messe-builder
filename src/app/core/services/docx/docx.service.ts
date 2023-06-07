import { Injectable, inject } from '@angular/core';
import {
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  Paragraph,
  TextRun,
} from 'docx';
import {
  Category,
  Item,
} from 'src/components/chant-input/chant-input.component';
import { StorageService } from '../storage/storage.service';
import type { DocxConfig } from '../../interfaces/document-config';
import { StorageKey } from '../../interfaces/document-config';

@Injectable({
  providedIn: 'root',
})
export class DocxService {
  /** Injection of {@link StorageService}. */
  private storageService = inject(StorageService);

  private docxConfig = this.storageService.getStorage<DocxConfig>(
    StorageKey.DocxConfig
  );

  public create(songs: Item[]): Document {
    return new Document({
      sections: [
        {
          properties: {
            page: {
              borders: {
                pageBorderRight: {
                  style: BorderStyle.NONE,
                  size: 0,
                },
                pageBorderLeft: {
                  style: BorderStyle.NONE,
                  size: 0,
                },
              },
              size: { orientation: this.docxConfig.orientation },
            },
            column: {
              space: '1cm', // space between column in 'cm'
              count: this.docxConfig.columnCount,
            },
          },
          children: [...this.createSectionChildren(songs)],
          headers: {
            first: new Header({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      size: '24pt',
                      text: this.docxConfig.churchName,
                    }),
                  ],
                }),
              ],
            }),
          },
          footers: this.createFooter(),
        },
      ],
    });
  }

  private createFooter() {
    if (this.docxConfig.email) {
      return {
        default: new Footer({
          children: [new Paragraph(`Contact: ${this.docxConfig.email}`)],
        }),
      };
    }
    return undefined;
  }

  private createContentByCategory(item: Item) {
    if (item.category === Category.READING) {
      return [this.createContent(this.removeTag(item.value))];
    }

    return this.lyricsParagraph(item.value);
  }

  private createSectionChildren(items: Item[]): Paragraph[] {
    return items.reduce(
      (acc, item) => [
        ...acc,
        this.createHeading(item.name),
        this.createSubHeading(item.title),
        ...this.createContentByCategory(item),
      ],
      [] as Paragraph[]
    );
  }

  private createHeading(text: string): Paragraph {
    return new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_2,
      thematicBreak: true,
    });
  }

  private createSubHeading(text: string): Paragraph {
    return text
      ? new Paragraph({
          spacing: {
            before: 100,
            after: 200,
          },
          children: [
            new TextRun({
              bold: true,
              italics: true,
              text: `${text}`,
            }),
          ],
        })
      : new Paragraph('');
  }

  private lyricsParagraph(text: string): Paragraph[] {
    // const regex = /(\d+\.)\n/g;
    const regex = /(\d+\.|R\.)\n/g;
    const spacedText =
      text.replace(regex, (match, captureGroup) => captureGroup) + '\n';

    return spacedText.split('\n').map((t) => this.createContentLyrics(t));
  }

  private createContentLyrics(text: string): Paragraph {
    return new Paragraph({ text });
  }

  private removeTag(contenu: string): string {
    /** Html tag. */
    const regexTag = /<[^>]+>/g;

    /** Multiple space. */
    const regexSpace = /\s+/g;

    return contenu.replace(regexTag, '').replace(regexSpace, ' ');
  }

  private createContent(text: string): Paragraph {
    return new Paragraph({
      spacing: {
        after: 200,
      },
      text,
    });
  }
}
