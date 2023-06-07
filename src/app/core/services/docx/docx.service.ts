import { Injectable, inject } from '@angular/core';
import {
  BorderStyle,
  Document,
  Header,
  HeadingLevel,
  Paragraph,
  TextRun,
} from 'docx';
import type { Item } from 'src/components/chant-input/chant-input.component';
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

  public create(songs: Item[], lectures: Item[]) {
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
          children: [
            ...this.createLyrics(songs),
            ...this.createReading(lectures),
          ],
          headers: {
            first: new Header({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      size: '24pt',
                      text: 'toto',
                    }),
                  ],
                }),
              ],
            }),
          },
          // footers: {
          //   default: new Footer({
          //     children: [new Paragraph('Contact: john@doe.com')],
          //   }),
          // },
        },
      ],
    });
  }

  public createLyrics(items: Item[]): Paragraph[] {
    return items.reduce(
      (acc, item) => [
        ...acc,
        this.createHeading(item.name),
        this.createSubHeading(item.title),
        ...this.doubleLigne(item.value),
      ],
      [] as Paragraph[]
    );
  }

  public createReading(items: Item[]): Paragraph[] {
    return items.reduce(
      (acc, item) => [
        ...acc,
        this.createHeading(item.name),
        this.createSubHeading(item.title),
        this.createContentList(this.removeTag(item.value)),
      ],
      [] as Paragraph[]
    );
  }

  public createHeading(text: string): Paragraph {
    return new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_2,
      thematicBreak: true,
    });
  }

  public createSubHeading(text: string): Paragraph {
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

  public doubleLigne(text: string): Paragraph[] {
    // const regex = /(\d+\.)\n/g;
    const regex = /(\d+\.|R\.)\n/g;
    const spacedText =
      text.replace(regex, (match, captureGroup) => captureGroup) + '\n';

    return spacedText.split('\n').map((t) => this.createContentLyrics(t));
  }

  public createContentLyrics(text: string): Paragraph {
    return new Paragraph({ text });
  }

  public removeTag(contenu: string): string {
    /** Html tag. */
    const regexTag = /<[^>]+>/g;

    /** Multiple space. */
    const regexSpace = /\s+/g;

    return contenu.replace(regexTag, '').replace(regexSpace, ' ');
  }

  public createContentList(text: string): Paragraph {
    return new Paragraph({
      spacing: {
        after: 200,
      },
      text,
    });
  }
}
