import { fetchItemsS3 } from "./fetch-items-s3";

describe("fetchItemsS3", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("returns folders", async () => {
    fetch.mockResponseOnce(
      `<?xml version="1.0" encoding="UTF-8"?>
<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <Name>gravitee-releases-downloads</Name>
    <Prefix></Prefix>
    <MaxKeys>100</MaxKeys>
    <Delimiter>/</Delimiter>
    <IsTruncated>false</IsTruncated>
    <CommonPrefixes>
        <Prefix>community/</Prefix>
    </CommonPrefixes>
    <CommonPrefixes>
        <Prefix>graviteeio-ae/</Prefix>
    </CommonPrefixes>
    <CommonPrefixes>
        <Prefix>graviteeio-am/</Prefix>
    </CommonPrefixes>
    <KeyCount>3</KeyCount>
</ListBucketResult>
        `
        .trim()
        .replace("\n", "")
    );

    const result = await fetchItemsS3("");

    expect(result).toEqual([
      { type: "prefix", name: "community/", prefix: "#community/" },
      { type: "prefix", name: "graviteeio-ae/", prefix: "#graviteeio-ae/" },
      { type: "prefix", name: "graviteeio-am/", prefix: "#graviteeio-am/" },
    ]);
  });

  it("returns files", async () => {
    fetch.mockResponseOnce(
      `<?xml version="1.0" encoding="UTF-8"?>
<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <Name>gravitee-releases-downloads</Name>
    <Prefix></Prefix>
    <MaxKeys>100</MaxKeys>
    <Delimiter>/</Delimiter>
    <IsTruncated>false</IsTruncated>
    <Contents>
        <Key>cla.pdf</Key>
        <LastModified>2021-05-18T03:38:43.937Z</LastModified>
        <ETag>"405a9272d618ac867f25fc293064805a"</ETag>
        <Size>36553</Size>
        <StorageClass>STANDARD</StorageClass>
        <Type>Normal</Type>
    </Contents>
    <Contents>
        <Key>favicon.ico</Key>
        <LastModified>2021-06-23T08:11:40.315Z</LastModified>
        <ETag>"460d830edba24e1cba3f7b432fe154dc"</ETag>
        <Size>54802</Size>
        <StorageClass>STANDARD</StorageClass>
        <Type>Normal</Type>
    </Contents>
    <Contents>
        <Key>index.html</Key>
        <LastModified>2021-04-08T07:04:47.408Z</LastModified>
        <ETag>"dcdc6d0c0497995dc7e85ff1ae1a5501"</ETag>
        <Size>17603</Size>
        <StorageClass>STANDARD</StorageClass>
        <Type>Normal</Type>
        </Contents>
    <Contents>
        <Key>logo.png</Key>
        <LastModified>2021-06-23T08:14:12.136Z</LastModified>
        <ETag>"989319166b499301c5993bbc29336a8b"</ETag>
        <Size>25253</Size>
        <StorageClass>STANDARD</StorageClass>
        <Type>Normal</Type>
    </Contents>
    <KeyCount>4</KeyCount>
</ListBucketResult>
        `
        .trim()
        .replace("\n", "")
    );

    const result = await fetchItemsS3("");

    expect(result).toEqual([
      {
        type: "content",
        name: "cla.pdf",
        key: "cla.pdf",
        size: 36553,
        url: "https://download.gravitee.io/cla.pdf",
        dateModified: new Date("2021-05-18T03:38:43.937Z"),
      },
      {
        type: "content",
        name: "favicon.ico",
        key: "favicon.ico",
        size: 54802,
        url: "https://download.gravitee.io/favicon.ico",
        dateModified: new Date("2021-06-23T08:11:40.315Z"),
      },
      {
        type: "content",
        name: "logo.png",
        key: "logo.png",
        size: 25253,
        url: "https://download.gravitee.io/logo.png",
        dateModified: new Date("2021-06-23T08:14:12.136Z"),
      },
    ]);
  });

  it("returns files", async () => {
    fetch
      .once(
        `<?xml version="1.0" encoding="UTF-8"?>
<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <Name>gravitee-releases-downloads</Name>
    <Prefix></Prefix>
    <MaxKeys>2</MaxKeys>
    <Delimiter>/</Delimiter>
    <IsTruncated>false</IsTruncated>
    <Contents>
        <Key>cla.pdf</Key>
        <LastModified>2021-05-18T03:38:43.937Z</LastModified>
        <ETag>"405a9272d618ac867f25fc293064805a"</ETag>
        <Size>36553</Size>
        <StorageClass>STANDARD</StorageClass>
        <Type>Normal</Type>
    </Contents>
    <Contents>
        <Key>favicon.ico</Key>
        <LastModified>2021-06-23T08:11:40.315Z</LastModified>
        <ETag>"460d830edba24e1cba3f7b432fe154dc"</ETag>
        <Size>54802</Size>
        <StorageClass>STANDARD</StorageClass>
        <Type>Normal</Type>
    </Contents>
    <NextContinuationToken>favicon.ico</NextContinuationToken>
    <KeyCount>2</KeyCount>
</ListBucketResult>
        `
          .trim()
          .replace("\n", "")
      )
      .once(
        `<?xml version="1.0" encoding="UTF-8"?>
<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <Name>gravitee-releases-downloads</Name>
    <Prefix></Prefix>
    <MaxKeys>2</MaxKeys>
    <Delimiter>/</Delimiter>
    <IsTruncated>false</IsTruncated>
    <Contents>
        <Key>index.html</Key>
        <LastModified>2021-04-08T07:04:47.408Z</LastModified>
        <ETag>"dcdc6d0c0497995dc7e85ff1ae1a5501"</ETag>
        <Size>17603</Size>
        <StorageClass>STANDARD</StorageClass>
        <Type>Normal</Type>
        </Contents>
    <Contents>
        <Key>logo.png</Key>
        <LastModified>2021-06-23T08:14:12.136Z</LastModified>
        <ETag>"989319166b499301c5993bbc29336a8b"</ETag>
        <Size>25253</Size>
        <StorageClass>STANDARD</StorageClass>
        <Type>Normal</Type>
    </Contents>
    <KeyCount>2</KeyCount>
</ListBucketResult>
        `
          .trim()
          .replace("\n", "")
      );

    const result = await fetchItemsS3("");

    expect(result).toEqual([
      {
        type: "content",
        name: "cla.pdf",
        key: "cla.pdf",
        size: 36553,
        url: "https://download.gravitee.io/cla.pdf",
        dateModified: new Date("2021-05-18T03:38:43.937Z"),
      },
      {
        type: "content",
        name: "favicon.ico",
        key: "favicon.ico",
        size: 54802,
        url: "https://download.gravitee.io/favicon.ico",
        dateModified: new Date("2021-06-23T08:11:40.315Z"),
      },
      {
        type: "content",
        name: "logo.png",
        key: "logo.png",
        size: 25253,
        url: "https://download.gravitee.io/logo.png",
        dateModified: new Date("2021-06-23T08:14:12.136Z"),
      },
    ]);
  });

  it("filters ignored patterns", async () => {
    fetch.mockResponseOnce(
      `<?xml version="1.0" encoding="UTF-8"?>
<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <Name>gravitee-releases-downloads</Name>
    <Prefix></Prefix>
    <MaxKeys>100</MaxKeys>
    <Delimiter>/</Delimiter>
    <IsTruncated>false</IsTruncated>
    <Contents>
        <Key>index.html</Key>
        <LastModified>2021-04-08T07:04:47.408Z</LastModified>
        <ETag>"dcdc6d0c0497995dc7e85ff1ae1a5501"</ETag>
        <Size>17603</Size>
        <StorageClass>STANDARD</StorageClass>
        <Type>Normal</Type>
        </Contents>
    <Contents>
        <Key>logo.png</Key>
        <LastModified>2021-06-23T08:14:12.136Z</LastModified>
        <ETag>"989319166b499301c5993bbc29336a8b"</ETag>
        <Size>25253</Size>
        <StorageClass>STANDARD</StorageClass>
        <Type>Normal</Type>
    </Contents>
    <KeyCount>4</KeyCount>
</ListBucketResult>
        `
        .trim()
        .replace("\n", "")
    );

    const result = await fetchItemsS3("");

    expect(result).toEqual([
      {
        type: "content",
        name: "logo.png",
        key: "logo.png",
        size: 25253,
        url: "https://download.gravitee.io/logo.png",
        dateModified: new Date("2021-06-23T08:14:12.136Z"),
      },
    ]);
  });

  it("sorts folder in first", async () => {
    fetch.mockResponseOnce(
      `<?xml version="1.0" encoding="UTF-8"?>
<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <Name>gravitee-releases-downloads</Name>
    <Prefix></Prefix>
    <MaxKeys>100</MaxKeys>
    <Delimiter>/</Delimiter>
    <IsTruncated>false</IsTruncated>
    <CommonPrefixes>
        <Prefix>graviteeio-ae/</Prefix>
    </CommonPrefixes>
    <CommonPrefixes>
        <Prefix>graviteeio-am/</Prefix>
    </CommonPrefixes>
    <Contents>
        <Key>logo.png</Key>
        <LastModified>2021-06-23T08:14:12.136Z</LastModified>
        <ETag>"989319166b499301c5993bbc29336a8b"</ETag>
        <Size>25253</Size>
        <StorageClass>STANDARD</StorageClass>
        <Type>Normal</Type>
    </Contents>
    <KeyCount>3</KeyCount>
</ListBucketResult>`
        .trim()
        .replace("\n", "")
    );

    const result = await fetchItemsS3();

    expect(result).toEqual([
      { type: "prefix", name: "graviteeio-ae/", prefix: "#graviteeio-ae/" },
      { type: "prefix", name: "graviteeio-am/", prefix: "#graviteeio-am/" },

      {
        type: "content",
        name: "logo.png",
        key: "logo.png",
        size: 25253,
        url: "https://download.gravitee.io/logo.png",
        dateModified: new Date("2021-06-23T08:14:12.136Z"),
      },
    ]);
  });

  it("sorts files by name", async () => {
    fetch.mockResponseOnce(
      `<?xml version="1.0" encoding="UTF-8"?>
<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <Name>gravitee-releases-downloads</Name>
    <Prefix>graviteeio-apim/distributions/</Prefix>
    <MaxKeys>100</MaxKeys>
    <Delimiter>/</Delimiter>
    <IsTruncated>false</IsTruncated>
    <Contents>
        <Key>graviteeio-apim/distributions/graviteeio-full-1.0.0.zip</Key>
        <LastModified>2021-04-07T20:30:43.805Z</LastModified>
        <ETag>"ab78bdab3a07d62e23bdd83bea51eced-16"</ETag>
        <Size>248619380</Size>
        <StorageClass>STANDARD</StorageClass>
        <Type>Normal</Type>
    </Contents>
     <Contents>
        <Key>graviteeio-apim/distributions/graviteeio-full-1.0.1.zip</Key>
        <LastModified>2021-04-08T20:30:43.805Z</LastModified>
        <ETag>"ab78bdab3a07d62e23bdd83bea51eced-16"</ETag>
        <Size>248619380</Size>
        <StorageClass>STANDARD</StorageClass>
        <Type>Normal</Type>
    </Contents>
    <Contents>
        <Key>graviteeio-apim/distributions/graviteeio-full-1.1.0.zip</Key>
        <LastModified>2021-04-07T20:30:44.329Z</LastModified>
        <ETag>"31e0d7338834f9fb71f45e05d98fe5e2-14"</ETag>
        <Size>205831416</Size>
        <StorageClass>STANDARD</StorageClass>
        <Type>Normal</Type>
    </Contents>
    <Contents>
        <Key>graviteeio-apim/distributions/graviteeio-full-1.10.0.zip</Key>
        <LastModified>2021-04-07T20:30:44.482Z</LastModified>
        <ETag>"dd7993b69bcfe07b86ea7e3d798e890a-13"</ETag>
        <Size>189611799</Size>
        <StorageClass>STANDARD</StorageClass>
        <Type>Normal</Type>
    </Contents>
    <Contents>
        <Key>graviteeio-apim/distributions/graviteeio-full-3.5.21.zip</Key>
        <LastModified>2021-11-02T10:37:15.707Z</LastModified>
        <ETag>"52fa85d6c3b80db22a9a97ace2f0c487"</ETag>
        <Size>253152247</Size>
        <StorageClass>STANDARD</StorageClass>
        <Type>Normal</Type>
    </Contents>
    <Contents>
        <Key>graviteeio-apim/distributions/graviteeio-full-3.13.0.zip</Key>
        <LastModified>2021-11-19T16:25:28.863Z</LastModified>
        <ETag>"30834580a56985b308fa46f83a4ba908-17"</ETag>
        <Size>251969024</Size>
        <StorageClass>STANDARD</StorageClass>
        <Type>Normal</Type>
    </Contents>
    <KeyCount>5</KeyCount>
</ListBucketResult>`
        .trim()
        .replace("\n", "")
    );

    const result = await fetchItemsS3("graviteeio-apim/distributions/");

    expect(result).toEqual([
      {
        type: "content",
        name: "graviteeio-full-3.13.0.zip",
        key: "graviteeio-apim/distributions/graviteeio-full-3.13.0.zip",
        size: 251969024,
        url: "https://download.gravitee.io/graviteeio-apim/distributions/graviteeio-full-3.13.0.zip",
        dateModified: new Date("2021-11-19T16:25:28.863Z"),
      },
      {
        type: "content",
        name: "graviteeio-full-3.5.21.zip",
        key: "graviteeio-apim/distributions/graviteeio-full-3.5.21.zip",
        size: 253152247,
        url: "https://download.gravitee.io/graviteeio-apim/distributions/graviteeio-full-3.5.21.zip",
        dateModified: new Date("2021-11-02T10:37:15.707Z"),
      },
      {
        type: "content",
        name: "graviteeio-full-1.10.0.zip",
        key: "graviteeio-apim/distributions/graviteeio-full-1.10.0.zip",
        size: 189611799,
        url: "https://download.gravitee.io/graviteeio-apim/distributions/graviteeio-full-1.10.0.zip",
        dateModified: new Date("2021-04-07T20:30:44.482Z"),
      },
      {
        type: "content",
        name: "graviteeio-full-1.1.0.zip",
        key: "graviteeio-apim/distributions/graviteeio-full-1.1.0.zip",
        size: 205831416,
        url: "https://download.gravitee.io/graviteeio-apim/distributions/graviteeio-full-1.1.0.zip",
        dateModified: new Date("2021-04-07T20:30:44.329Z"),
      },
      {
        type: "content",
        name: "graviteeio-full-1.0.1.zip",
        key: "graviteeio-apim/distributions/graviteeio-full-1.0.1.zip",
        size: 248619380,
        url: "https://download.gravitee.io/graviteeio-apim/distributions/graviteeio-full-1.0.1.zip",
        dateModified: new Date("2021-04-08T20:30:43.805Z"),
      },
      {
        type: "content",
        name: "graviteeio-full-1.0.0.zip",
        key: "graviteeio-apim/distributions/graviteeio-full-1.0.0.zip",
        size: 248619380,
        url: "https://download.gravitee.io/graviteeio-apim/distributions/graviteeio-full-1.0.0.zip",
        dateModified: new Date("2021-04-07T20:30:43.805Z"),
      },
    ]);
  });

  it("throws if incorrect response", async () => {
    fetch.mockResponseOnce(
      `<?xml version="1.0" encoding="UTF-8"?>
<ListBucketResults xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
</ListBucketResults>
        `
        .trim()
        .replace("\n", "")
    );

    await expect(fetchItemsS3("")).rejects.toEqual(
      new Error("List bucket response does not contain <ListBucketResult> tag!")
    );
  });
});
