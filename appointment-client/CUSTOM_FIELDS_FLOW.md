# Custom Fields Flow

This document explains how calendar custom fields are passed on create/update, saved after the calendar exists, and fetched back by `calendarId`.

## High Level Flow

Custom fields are represented on the calendar payload as `appointmentUserDefinedFields`.

They are not sent as part of the core calendar `POST /Calendar/Create` or calendar update request. `mapCalendarBOToSnapshot` only maps fields that belong to the Blazeo calendar model. After the calendar save succeeds and a `calendarId` is available, the client saves the custom field form separately.

Create/update with relations:

1. `createCalendarWithRelationsAsync(calendar, options)` or `updateCalendarWithRelationsAsync(calendar, options)` saves the calendar body first.
2. The resulting calendar id is resolved from the saved calendar node or the input payload.
3. `saveCalendarRelationsAfterSave` saves related data after the calendar save.
4. `saveCalendarAppointmentForm(calendarId, calendar, connection)` collects `appointmentUserDefinedFields`.
5. Fields are transformed to Blazeo custom-field API rows.
6. The client calls:

```http
POST /CustomField/Form/Save?calendar_id={calendarId}
Content-Type: application/json
```

The request body is an array of custom field rows.

If the calendar payload has no custom field rows, the form save is skipped.

## Where Fields Are Read From

The preferred calendar payload key is:

```json
{
  "appointmentUserDefinedFields": []
}
```

The collector also accepts these fallback keys:

- `AppointmentUserDefinedFields`
- `formFields`
- `FormFields`
- `customFormFields`
- `CustomFormFields`

## Expected Calendar Payload

Use `appointmentUserDefinedFields` when creating or updating a calendar:

```json
{
  "companyKey": "company_key",
  "name": "Demo calendar",
  "timeZoneId": "Pakistan Standard Time",
  "duration": 20,
  "appointmentUserDefinedFields": [
    {
      "fieldLabel": "First Name",
      "fieldKey": "FirstName",
      "fieldId": "0702d225-45b1-4381-b24b-e788b17c2915",
      "isRequired": true,
      "isMandatory": true
    },
    {
      "fieldLabel": "Email",
      "fieldKey": "Email",
      "fieldId": "c2c08947-4050-41ba-8d59-3ccff8bbbd79",
      "isRequired": true,
      "isMandatory": true
    },
    {
      "fieldName": "Test dropdown",
      "fieldId": "guid Id",
      "leadCustomOptions": [
        { "value": "A" },
        { "value": "B" }
      ]
    }
  ]
}
```

Important update rule:

- Include the existing `fieldId`, `dataId`, or `customFieldId` when updating an existing field.
- If no id is provided, the mapper generates a new id and the row is treated as a new custom field row.
- Use the remove helpers when deleting fields: `removeCalendarFormField` for one field or `removeAllCalendarFormFields` for all fields on a calendar.

## Supported Input Row Shapes

### Calendar-Style Rows

Calendar-style rows are used for standard booking fields:

```json
{
  "fieldLabel": "First Name",
  "fieldKey": "FirstName",
  "fieldId": "0702d225-45b1-4381-b24b-e788b17c2915",
  "fieldToolTipText": "",
  "isRequired": true,
  "isMandatory": true,
  "sortOrder": 0,
  "calendarId": 0
}
```

Mapping behavior:

- `fieldLabel` becomes API `Label`.
- `fieldId` becomes both API `DataId` and `CustomFieldId`.
- `isRequired` or `isMandatory` becomes API `IsRequired`.
- `fieldKey` is used as a type hint when no explicit type is present.
- Known `fieldKey` hints include `Email`, `Phone`, `FirstName`, `LastName`, `Name`, `Company`, `Address`, `City`, `State`, `Zip`, `PostalCode`, and `Country`.
- If no type can be inferred, `Type` defaults to `Text`.

### Lead/Custom-Style Rows

Lead-style rows are used for custom lead fields and option-based fields:

```json
{
  "fieldName": "Test dropdown",
  "fieldType": 3,
  "fieldSubType": 303,
  "description": "Test dropdown",
  "isImportant": false,
  "isRequired": true,
  "isMandatory": true,
  "leadCustomOptions": [
    { "value": "A" },
    { "value": "B" },
    { "value": "C" }
  ]
}
```

Mapping behavior:

- `fieldName` becomes API `Label`.
- `fieldSubType` determines API `Type`.
- `leadCustomOptions` becomes the option list for dropdown, radio, checkbox, or multiselect fields.
- Each option is mapped to `{ "Key": "...", "Value": "..." }`.
- If an option has no `key`, one is generated from its value.

Supported `fieldSubType` values:

- `301`: `Text`
- `302`: `Email`
- `303`: `Dropdown`
- `304`: `MultilineText`
- `305`: `Number`
- `306`: `Phone`
- `307`: `Date`
- `308`: `Checkbox`
- `309`: `RadioButton`
- `310`: `MultiselectList`

### API-Shaped Rows

Rows that already match the Blazeo custom-field API can also be supplied:

```json
{
  "Value": null,
  "DataId": "0702d225-45b1-4381-b24b-e788b17c2915",
  "CustomFieldId": "0702d225-45b1-4381-b24b-e788b17c2915",
  "IsRequired": true,
  "Label": "First Name",
  "Type": "Text"
}
```

An API-shaped row is detected when it has a string `Type` plus either ids or a `Label`. These rows are passed through as-is by the mapper. `saveCustomFieldForm` can also be called with `fieldsAlreadyApiFormat: true` or `skipTransform: true`.

## Payload Sent To Blazeo

The final API body sent to `POST /CustomField/Form/Save?calendar_id={calendarId}` looks like this:

```json
[
  {
    "Value": null,
    "DataId": "0702d225-45b1-4381-b24b-e788b17c2915",
    "CustomFieldId": "0702d225-45b1-4381-b24b-e788b17c2915",
    "IsRequired": true,
    "Label": "First Name",
    "Type": "Text"
  },
  {
    "Value": null,
    "DataId": "c2c08947-4050-41ba-8d59-3ccff8bbbd79",
    "CustomFieldId": "c2c08947-4050-41ba-8d59-3ccff8bbbd79",
    "IsRequired": true,
    "Label": "Email",
    "Type": "Email"
  },
  {
    "Value": null,
    "DataId": "generated-or-existing-guid",
    "CustomFieldId": "generated-or-existing-guid",
    "IsRequired": false,
    "Label": "Test dropdown",
    "Type": "Dropdown",
    "DropdownOptions": [
      { "Key": "a", "Value": "A" },
      { "Key": "b", "Value": "B" }
    ]
  }
]
```

Option list keys by type:

- `Dropdown` uses `DropdownOptions`.
- `RadioButton` uses `RadioButtonOptions`.
- `MultiselectList` uses `multiselectListOptions`.
- `Checkbox` uses `checkBoxOptions`.

## Fetching By Calendar Id

The calendar detail flow loads custom fields by `calendarId` when form fields are enabled:

```http
GET /CustomField/Form/Get?calendar_id={calendarId}
```

The direct helper is:

```ts
await fetchCalendarAppointmentForm(calendarId, { baseUrl, consumer });
```

`fetchCalendarDetails(calendarId)` and `fetchCalendarBundle(calendarId)` include this fetch by default because `includeUnifiedCalendarView` defaults to `true`, and `includeFormFields` defaults to the same value.

Returned API rows are unwrapped from common envelope shapes and converted back into frontend rows for `appointmentUserDefinedFields`. For example:

- API `Label` maps back to `fieldLabel` or `fieldName`.
- API `Type` maps back to `fieldSubType` where possible.
- API `CustomFieldId` or `DataId` maps back to `fieldId`.
- API options map back to `leadCustomOptions`.

The resulting calendar view includes:

```json
{
  "calendarId": "calendar-guid",
  "appointmentUserDefinedFields": []
}
```

## Relevant Code

- `src/calendar/calendarCreation.ts`: orchestrates create/update with relations.
- `src/calendar/saveCalendarRelationsAfterSave.ts`: saves preferences, locations, then custom fields.
- `src/calendar/saveCalendarForm.ts`: saves `appointmentUserDefinedFields` after calendar create/update.
- `src/customField/saveCustomFieldForm.ts`: posts to `/CustomField/Form/Save`.
- `src/customField/mapFormFieldsToApi.ts`: maps frontend rows to API rows.
- `src/calendar/fetchCalendarForm.ts`: fetches custom fields by `calendarId`.
- `src/calendar/fetchCalendarDetails.ts`: attaches fetched fields to the calendar view.
