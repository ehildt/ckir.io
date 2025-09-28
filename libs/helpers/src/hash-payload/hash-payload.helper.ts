import { BinaryToTextEncoding, createHash } from 'crypto';

export type HashPayloadSupportedAlgorithm = 'sha256' | 'sha384' | 'sha512';

/**
 * Generates a cryptographic hash for the given input using a supported algorithm.
 *
 * - If the input is an object/record, it is serialized with `JSON.stringify`.
 * - If the input is already a string, it is hashed directly.
 * - The algorithm must be one of `'sha256' | 'sha384' | 'sha512'`.
 *
 * @param payload - Object or string to hash.
 * @param algorithm - Hash algorithm to use (default: `'sha512'`).\
 * Supported values: `'sha256' | 'sha384' | 'sha512'`.
 * @param encoder - Output encoding (default: `'hex'`). \
 * Options: `'hex'`, `'base64'`, `'latin1'`.
 * @returns The hash digest as a string in the chosen encoding.
 *
 * @example
 * ```ts
 * const hash1 = hashPayload("hello");
 * // default SHA-512, hex encoded
 *
 * const hash2 = hashPayload({ foo: "bar" }, "sha256", "base64");
 * // SHA-256, base64 encoded
 * ```
 */
export function hashPayload(
  payload: Record<any, any> | string,
  algorithm: HashPayloadSupportedAlgorithm = 'sha256',
  encoder: BinaryToTextEncoding = 'hex',
) {
  const input = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return createHash(algorithm).update(input).digest(encoder);
}
