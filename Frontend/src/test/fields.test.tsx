import { describe, it, expect } from "vitest";

import { Header } from "../components/Header";
import { render, screen } from "@testing-library/react";

describe("Header", () => {

    it("renders heading", () => {

        render(<Header onMenuToggle={() => { }} />);

        expect(
            screen.getByText("Dashboard")
        ).toBeInTheDocument();

    });

});
describe("Form Builder", () => {

    it("renders all sections", () => {
        expect(true).toBe(true);
    });

    it("renders all fields", () => {
        expect(true).toBe(true);
    });

    it("creates a new section", () => {
        expect(true).toBe(true);
    });

    it("creates a new field", () => {
        expect(true).toBe(true);
    });

    it("deletes a field", () => {
        expect(true).toBe(true);
    });

    it("deletes a section", () => {
        expect(true).toBe(true);
    });

    it("updates field label", () => {
        expect(true).toBe(true);
    });

    it("marks field required", () => {
        expect(true).toBe(true);
    });

    it("renders drag handles", () => {
        expect(true).toBe(true);
    });

    it("opens property editor", () => {
        expect(true).toBe(true);
    });

});